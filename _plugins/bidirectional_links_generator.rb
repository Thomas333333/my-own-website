# Build a non-destructive, categorized library and resolve Obsidian links.
require 'cgi'
require 'json'
require 'digest'
class BidirectionalLinksGenerator < Jekyll::Generator
  priority :highest
  CATEGORIES = {
    'papers' => ['论文阅读', 'Papers & reading'],
    'projects' => ['项目记录', 'Project logs'],
    'algorithms' => ['算法与课程', 'Algorithms & courses'],
    'tools' => ['工具与方法', 'Tools & workflow'],
    'life' => ['生活与随笔', 'Life & reflections'],
    'weekly' => ['研究周报', 'Research journal']
  }.freeze
  LEGACY = {'Projects'=>'projects','Paper-Reading'=>'papers','Algorithm and Classes'=>'algorithms','Life'=>'life','Weekly-summary'=>'weekly'}.freeze
  def canonical_path(doc)
    doc.relative_path.sub(%r{\A/?_notes/}, '').sub(%r{\A_notes/}, '')
  end
  def category(doc)
    path = canonical_path(doc)
    return 'weekly' if path.include?('weekly-summary')
    return 'life' if path.include?('生活/') || path.include?('papers-reading/黑客与画家')
    return 'papers' if path.include?('papers-reading')
    return 'algorithms' if path.include?('算法知识') || path.include?('智能机器与控制')
    return 'tools' if path.include?('百科全书') || path.include?('小技巧') || path.include?('obsidian') || path.include?('Model_Comparison')
    'projects'
  end
  def generate(site)
    notes = site.collections['notes'].docs
    audit = []
    chosen = notes.group_by { |d| canonical_path(d) }.map do |path, variants|
      # Use the original source; migration copies are excluded from the build.
      selected = variants.min_by { |d| [d.relative_path.count('/'), d.relative_path] }
      variants.reject { |d| d == selected }.each do |d|
        audit << {'selected'=>selected.relative_path, 'retained_source'=>d.relative_path,
                  'identical'=>d.content.strip == selected.content.strip}
      end
      selected
    end
    site.collections['notes'].docs.replace(chosen)
    library = []
    chosen.each do |doc|
      raw = File.read(doc.path)
      explicit_title = raw.start_with?('---') && raw.split(/^---\s*$/, 3)[1].to_s.match?(/^title:/)
      doc.data['title'] = File.basename(doc.path, '.md') unless explicit_title
      name = File.basename(doc.path, '.md')
      group = category(doc)
      doc.data['library_category'] = group
      doc.data['category_label'] = CATEGORIES[group][0]
      doc.data['lang'] ||= 'zh'
      doc.data['translation_url'] = '/'
      # Obsidian delimiters in snippets must not be interpreted as Liquid templates.
      doc.data['render_with_liquid'] = false
      if LEGACY.key?(name) && canonical_path(doc).include?('网页首页链接跳转')
        doc.data['permalink'] = '/notes/project-log-index/' if name == 'Projects'
        doc.content = "<p>笔记已按主题整理。<a href='#{site.baseurl}/notes/##{LEGACY[name]}'>打开#{CATEGORIES[LEGACY[name]][0]} →</a></p>"
        doc.data['library_hidden'] = true
      end
      if %w[test your-first-note].include?(name) || canonical_path(doc).start_with?('模板/')
        doc.data['library_hidden'] = true
        doc.content = "<p>这是一篇旧模板。<a href='#{site.baseurl}/notes/'>进入笔记库 →</a></p>"
      end
      next if doc.data['library_hidden']
      library << {'title'=>doc.data['title'], 'url'=>doc.url, 'category'=>group,
                  'path'=>doc.relative_path, 'date'=>File.mtime(doc.path).strftime('%Y-%m-%d')}
    end
    # Explicit path aliases first; ambiguous bare names resolve deterministically.
    aliases = {}
    chosen.each do |doc|
      [canonical_path(doc).sub(/\.md\z/, ''), doc.relative_path.sub(%r{\A/}, '').sub(/\.md\z/, '')].each { |s| aliases[s.downcase] = doc }
    end
    chosen.each do |doc|
      [File.basename(doc.path, '.md'), doc.data['title']].each { |s| aliases[s.to_s.downcase] ||= doc }
    end
    all_docs = chosen + site.pages
    outgoing = Hash.new { |h,k| h[k] = [] }
    unresolved = []
    all_docs.each do |doc|
      next unless doc.respond_to?(:content)
      # Leave code fences, inline code, and existing HTML attributes untouched.
      segments = doc.content.split(/(```.*?```|~~~.*?~~~|`[^`\n]+`)/m)
      doc.content = segments.map.with_index do |part, index|
        next part if index.odd?
        part.gsub(/(!?)\[\[([^\]\n]+)\]\]/) do
          embed = Regexp.last_match(1) == '!'
          raw = Regexp.last_match(2)
          target, label = raw.split('|', 2)
          filename, heading = target.split('#', 2)
          linked = filename.empty? ? doc : aliases[filename.sub(/\.md\z/, '').downcase]
          if linked
            outgoing[doc] << linked unless linked == doc
            anchor = heading ? "##{Jekyll::Utils.slugify(heading, mode: 'default')}" : ''
            text = label || linked.data['title'] || filename
            "<a class='internal-link' href='#{CGI.escapeHTML(site.baseurl + linked.url + anchor)}'>#{CGI.escapeHTML(text)}</a>"
          elsif embed
            asset = site.static_files.find { |f| f.name == File.basename(filename) }
            if asset && filename.match?(/\.(png|jpe?g|gif|webp|svg)\z/i)
              "<img loading='lazy' src='#{CGI.escapeHTML(site.baseurl + asset.url)}' alt='#{CGI.escapeHTML(File.basename(filename))}'>"
            else
              unresolved << {'source'=>doc.path,'target'=>target}
              "<span class='invalid-link'>#{CGI.escapeHTML(label || filename)}</span>"
            end
          else
            unresolved << {'source'=>doc.path,'target'=>target}
            "<span class='invalid-link' title='原始笔记库中暂无对应页面'>#{CGI.escapeHTML(label || target)}</span>"
          end
        end
      end.join
    end
    chosen.each do |doc|
      doc.data['backlinks'] = chosen.select { |other| outgoing[other].include?(doc) && !other.data['library_hidden'] }
      doc.data['outgoing_notes'] = outgoing[doc].uniq
    end
    redirects = Jekyll::PageWithoutAFile.new(site, site.source, '', '_redirects')
    redirects.data['layout'] = nil
    redirects.content = "/projects.html /notes/#projects 301\n" + chosen.map { |doc| "#{doc.url.chomp('/')}.html #{doc.url} 301" }.join("\n") + "\n"
    site.pages << redirects
    site.data['library'] = library.sort_by { |n| [n['category'], n['title'].downcase] }
    site.data['note_categories'] = CATEGORIES.map { |id,labels| {'id'=>id,'title'=>labels[0],'en'=>labels[1]} }
    # Diagnostic output stays outside the published site (docs/ is excluded).
    report_dir = File.join(site.source, 'docs')
    FileUtils.mkdir_p(report_dir)
    File.write(File.join(report_dir, 'notes-audit.json'), JSON.pretty_generate({'source_documents'=>notes.size + audit.size,'library_documents'=>library.size,'duplicates'=>audit,'unresolved_links'=>unresolved}))
    Jekyll.logger.info 'Notes library:', "#{library.size} entries, #{audit.size} duplicate copies retained on disk; #{unresolved.size} unresolved legacy links"
  end
end
