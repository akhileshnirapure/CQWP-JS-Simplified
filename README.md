Content Query WebPart and JavaScript Simplified
===============================================

Working with Content Query Webpart, you should be good at XSLT, Showing only roll-up data from site collection and with complex view, nightmares when you want to integrate with with javascript plugins.


Warining : The approach works only with static data and not realtime, so no scenario with paging.
========

Content Query WebPart is excellent at rollingup data from all site and good at caching the data too. But the problem is you have to deal with another language XSLT if you want to work properly with OOB template customiztions.

Idea : 
====

Let Content Query WebPart generate the XML (Result) and let the client side script webpart take over to render content 
using any javascript framework you want.

Solution Main Component
=======================

ContentQueryRaw.xsl : 
-------------------
The xsl which is a copy of main.xsl dumps the CQWP result in a div within a Comment.

Raw Result CQWP.webpart : 
-----------------------
The Content Query Webpart which can be configured as we want, its just we need to ensure the 

<property name="MainXslLink" type="string">/Style Library/XSL Style Sheets/ContentQueryRaw.xsl</property>

is pointing to the xsl which dumps the result.

xml2js.js
---------

Thanks to Abdulla Abdurakhmanov Developer of https://code.google.com/p/x2js/ (x2js) which converts the XML string to Json Object/array.

Code
----

Some javascript functions to make the result appropriate
```
var parserService = (function (p_jquery) {
    var self = this,
        targetElement;

    self.init = function (element) {
        targetElement = p_jquery(element);
    };

    self.getJSONFromXml = function (data) {
        var x2js = new X2JS();
        var result = JSON.stringify(x2js.xml_str2json(data));
        return p_jquery.parseJSON(result);
    };

    self.replaceAll = function(find, replace, str) {
        return str.replace(new RegExp(find, 'g'), replace);
    };

    self.parse = function () {
        var rawdata = p_jquery(targetElement).html();

        //  jquery html method doesn't properly create the closing tag
        //  replacing the short-hand version of closing tag with explicit version
        //  this is required for plugin to parse properly
        var fixXml = self.replaceAll("/>", "></Row>", rawdata);

        //  removing the comment start tag
        var removeCommentStart = self.replaceAll("<!--", "", fixXml);

        //  removing the comment end tag
        var removeCommentEnd = self.replaceAll("-->", "", removeCommentStart);

        var result = self.getJSONFromXml(removeCommentEnd);

        return result.Rows.Row;
    };

    return {
        init: self.init,
        Data : self.parse
    }
})($);
```

Now you can use this service with any framework you want, i've chosen to use with KO.

You can put this module in Script WebPart and render content as you want.

Let me know if you have any suggestion.

Thanks
Akhilesh Nirapure // @AkhileshN
