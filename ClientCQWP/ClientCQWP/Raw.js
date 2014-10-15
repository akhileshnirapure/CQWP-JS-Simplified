/// <reference path="C:\Akhilesh\Git\CQWP-JS-Simplified\ClientCQWP\ClientCQWP\Scripts/jquery-2.1.1.intellisense.js" />
/// <reference path="C:\Akhilesh\Git\CQWP-JS-Simplified\ClientCQWP\ClientCQWP\Scripts/knockout-3.2.0.js" />


//  Parser Service
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


(function (p_jquery,p_parser) {
    
    //  Page Model
    var page = function (data) {
        var self = this;
        self.title = ko.observable(data._Title); // all the properties are prefixed with _
        self.url = ko.observable(data._LinkUrl);
    };

    // Page View Model
    var vmPage = function () {
        var self = this;

        //  Constructor function to build the items 
        self.init = function (results) {
            ko.utils.arrayForEach(results, function (item) {
                var res = new page(item);
                self.items.push(res);
            });
        };

        //  Hold all the items
        self.items = ko.observableArray();

        return {
            init: self.init,
            items: self.items
        }
    };

    //  App Start 
    p_jquery(document).ready(function () {
        p_parser.init("#rawData");
        var data = p_parser.Data();

        var vm = new vmPage();
        vm.init(data);
        //console.log(vm);
        ko.applyBindings(vm);
    });
    

}($,parserService));