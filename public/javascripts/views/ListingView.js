window.ListingView = DestroyableView.extend({
    tagname: "div",
    id: "ListingView",

	events: {		
	    'click #buyButton': 'buyItem',		
	},

	initialize:function (options) {
        this.childViews = [];
        this.render(options);
    },

    render: function(info){
        info.parentDiv.append(this.$el);
    	if (info.id) {
    		this.model = new Listing({id:info.id});
    		var listingView = this;
	    	this.model.fetch({
	    		success: function(listing){
	    			listingView.$el.html(listingView.template(listing.attributes));
	         		return listingView;
	    		},
	    		error: function(err){
                    console.log('Error loading object from server!');
	    		}
            });
	    }
	    else{
	    	console.log('no object to look for');
	    }
    },

    buyItem: function(options){	
    	if(this.id){	
    		this.model = new Listing({id:this.id});		
    		var listingView = this;		
			
			//sets the listing open to false in the backbone model
    		this.model.set({		
    			listing_open: false		
    		});		
			
			//saves backbone model and does PUT request to server
    		this.model.save({
    			success: function(listing){
    				console.log(listing.attributes);
    			},
    			error: function(){
    				console.log('error buying item');
    			}		
    		});

			//TODO: will eventually show success message
            // Create a new view.
            var payView = new PayView({el: $('#buyButton')});
            this.childViews.push(payView);
            $("#buyButton").replaceWith(payView.template());

			// Backbone.history.navigate('#home');
        	// Backbone.history.loadUrl('#home');
    	}

    	else{
    		alert("Error buying item. Please try re-logging in and refreshing page.");
    	}
    }
});
