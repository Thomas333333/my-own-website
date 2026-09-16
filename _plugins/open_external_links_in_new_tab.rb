require 'nokogiri'
Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == '.html' && doc.site.config['open_external_links_in_new_tab']
  html = Nokogiri::HTML.parse(doc.output)
  html.css('a[href]').each do |link|
    next unless link['href'].match?(%r{\Ahttps?://})
    link['target'] = '_blank'
    link['rel'] = 'noopener noreferrer'
  end
  doc.output = html.to_html
end
