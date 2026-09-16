# Read Obsidian Markdown in memory, without adding YAML to files on disk.
Jekyll::Hooks.register :site, :post_read do |site|
  collection = site.collections['notes']
  next unless collection
  known = collection.docs.map { |doc| File.expand_path(doc.path) }
  Dir.glob(File.join(site.source, '_notes', '**', '*.md')).each do |path|
    next if known.include?(File.expand_path(path)) || path.include?('/.obsidian/')
    # Retain migration copies locally without ever publishing them.
    next if path.start_with?(File.join(site.source, '_notes', '_notes') + '/')
    doc = Jekyll::Document.new(path, :site => site, :collection => collection)
    doc.read
    collection.docs << doc if site.unpublished || doc.published?
  end
  site.static_files.reject! { |file| file.path.start_with?(File.join(site.source, '_notes')) && file.extname == '.md' }
end
