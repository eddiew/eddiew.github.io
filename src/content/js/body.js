---
combined: true
---
<%=
	out = []
	for file in @config[:jsBody]
		item = @items["/js/#{file}/"]
		out << item.compiled_content if item
	end
	out.join("\n")
%>