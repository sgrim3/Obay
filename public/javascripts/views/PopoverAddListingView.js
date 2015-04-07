window.PopoverAddListingView = AddListingView.extend({
	events: {
	    'click #exitButton': 'broadcoastExitPopoverAddListing',
	},

    broadcoastExitPopoverAddListing: function(){
        Backbone.pubSub.trigger('exitPopoverAddListing');
    },

    destroyView: function() {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();
        this.$el.removeData().unbind(); 
        // Remove view from DOM
        this.remove();  
        Backbone.View.prototype.remove.call(this);
    },
});
