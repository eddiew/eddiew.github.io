def all_js(files)
  js_arr = []
  for file in files
    item = @items.find{|i| i.identifier == "/js/#{file}/"}
    unless item
      puts "Script #{file} doesn't exist!"
      next
    end
    js_arr << item.compiled_content
  end
  js_arr.join("\n")
end

def all_css(files)
  css_arr = []
  for file in files
    item = @items.find{|i| i.identifier == "/css/#{file}/"}
    unless item
      puts "Stylesheet #{file} doesn't exist!"
      next
    end
    css_arr << item.compiled_content
  end
  css_arr.join("\n")
end