## CANNOT INSTALL NOKOGIRI FOR SOME REASON
## encoding: utf-8
#require 'nokogiri'
#
#class HTMLCompressFilter < Nanoc::Filter
#  identifier :html_compress
#  type :text
#
#  def run(content, params={})
#    doc = Nokogiri::HTML(content)
#    
#    # Find comments.
#    doc.xpath("//comment()").each do |comment|
#        # Check it's not a conditional comment.
#        if (comment.content !~ /\A(\[if|\<\!\[endif)/)
#            comment.remove()
#        end
#    end
#
#    doc.to_html
#  end
#end