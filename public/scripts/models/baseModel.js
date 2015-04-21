/*
Backbone base model 
All other models extend from this one
*/

define([
  'backbone',
], function (Backbone) {
  var BaseModel = Backbone.Model.extend({
  });

  // QUESTION: There's nothing in BaseModel? What's its purpose?

  return BaseModel;
});
