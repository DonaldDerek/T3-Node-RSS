
/**
 * Node T3 RSS - Newsletter (MailChimp)
 */

var express = require('express'),
	http = require('http'),
	path = require('path'),
	FeedParser = require('feedparser'),
    request = require('request'),
    $ = require('jquery'),
	fs = require('fs'),
	RSS = require('rss');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//Process the English Feed
app.get('/newsletter/en', function(req, res){
    
        var jsonObj=[];
        var feed = new RSS({
        			title: 'T3ME - Weekly Digest',
        			description: 'Gadgets, Reviews and Technology News For the Middle East and Arabic World',
        			feed_url: 'http://t3me.com/rss/all',
        			site_url: 'http://t3me.com',
        			managingEditor: 'Simon Khoury',
        			webMaster: 'Donald Derek Haddad',
        			copyright: '2013 MPS',
        			language: 'en',
        			ttl: '60'
    			});
        
        $("<div class='articles'></div>").appendTo("body");
        
        request('http://t3me.com/rss/all')
        .pipe(new FeedParser())
        .on('error', function(error) {
          console.log(error);
          return res.send(jsonParsed);   
        })
        .on('meta', function (meta) {
          //console.log(meta);
        })
        .on('readable', function () {
          var stream = this, item;
          while (item = stream.read()) {
                
              //DOM Maniupulation: Cleaning description from related links and authors
              $("<div class='article'>"+item.description+"</div>").appendTo("body");   
              $(".article").find('p').eq(-1).remove();   
              $(".article").find('table').eq(-1).remove();
              $(".article").find('a').attr('target', '_system');  
              
              
              //Constructing Summar, type and proper guid
              var summary = $(".article").find('h3').first()
              , image = $(".article").find('img').first().attr('src')
              , guidStr = item.guid
              , arr = guidStr.split('/')
              , type = arr[3]
              , guid = arr[arr.length-1];
              
              //DOM Manipulation: remove first image then construct the article
              $(".article").find('img').first().remove();  
              
              if(type === "news"){
                $(".article").find('table').eq(-1).remove();  
              }
              
              var article = $(".article ").html()
              //Cleaning Summary
              cleanSummary = $(summary).text($(summary).text());

              var fullSummary = $("<div><img src='"+image+"' width='240'/><p>"+cleanSummary.text()+"</p></div>");
              
              //adding article to the jsonObj and flush "bad written" articles
              if($(summary).text().length > 3 && (type === "news" || type === "features")){
                jsonObj.push({guid: guid,
                                type: type, 
                                image: image,
                                title: item.title, 
                                description: article, 
                                summary: cleanSummary.text(),
                                categories: item.categories,
                                author: item.author,
                                pubDate: item.pubdate});
             }

			//Loop over data and add to feed 
			feed.item({
			    title:  item.title,
			    description: fullSummary.html(),
			    url: item.guid, 
			    guid: guid,
			    categories: item.categories,
			    author: item.author, 
			    date: item.pubdate
			});         
            
            //Remove from DOM
            $(".article").remove();
          }
    
        })
        .on('end', function(){

			// cache the xml
			var xml = feed.xml();   
			res.type('rss');

			//Spit back Response
            return res.send(xml);
        })
});

//Process the English Feed
app.get('/newsletter/ar', function(req, res){

        var jsonObj=[];
        var feed = new RSS({
        			title: 'T3ME - Weekly Digest',
        			description: 'Gadgets, Reviews and Technology News For the Middle East and Arabic World',
        			feed_url: 'http://t3me.com/rss/all',
        			site_url: 'http://t3me.com',
        			managingEditor: 'Simon Khoury',
        			webMaster: 'Donald Derek Haddad',
        			copyright: '2013 MPS',
        			language: 'ar',
        			ttl: '60'
    			});
        
        $("<div class='articles'></div>").appendTo("body");
        
        request('http://t3me.com/ar/rss/all')
        .pipe(new FeedParser())
        .on('error', function(error) {
          console.log(error);
          return res.send(jsonParsed);   
        })
        .on('meta', function (meta) {
          //console.log(meta);
        })
        .on('readable', function () {
          var stream = this, item;
          while (item = stream.read()) {
                
              //DOM Maniupulation: Cleaning description from related links and authors
              $("<div class='article'>"+item.description+"</div>").appendTo("body");   
              $(".article").find('p').eq(-1).remove();   
              $(".article").find('table').eq(-1).remove();
              $(".article").find('a').attr('target', '_system');  
              
              
              //Constructing Summar, type and proper guid
              var summary = $(".article").find('h3').first()
              , image = $(".article").find('img').first().attr('src')
              , guidStr = item.guid
              , arr = guidStr.split('/')
              , type = arr[3]
              , guid = arr[arr.length-1];
              
              //DOM Manipulation: remove first image then construct the article
              $(".article").find('img').first().remove();  
              
              if(type === "news"){
                $(".article").find('table').eq(-1).remove();  
              }
              
              var article = $(".article ").html()
              //Cleaning Summary
              cleanSummary = $(summary).text($(summary).text());

              var fullSummary = $("<div><img src='"+image+"' width='240'/><p>"+cleanSummary.text()+"</p></div>");
              
              //adding article to the jsonObj and flush "bad written" articles
              if($(summary).text().length > 3 && (type === "news" || type === "features")){
                jsonObj.push({guid: guid,
                                type: type, 
                                image: image,
                                title: item.title, 
                                description: article, 
                                summary: cleanSummary.text(),
                                categories: item.categories,
                                author: item.author,
                                pubDate: item.pubdate});
             }

			//Loop over data and add to feed 
			feed.item({
			    title:  item.title,
			    description: fullSummary.html(),
			    url: item.guid, 
			    guid: guid,
			    categories: item.categories,
			    author: item.author, 
			    date: item.pubdate
			});         
            
            //Remove from DOM
            $(".article").remove();
          }
    
        })
        .on('end', function(){

			// cache the xml
			var xml = feed.xml();   
			res.set('Content-Type', 'application/rss+xml');
			res.set('encoding', 'utf8');
			//Spit back Response
            return res.send(xml);
        })
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
