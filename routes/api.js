/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const librarySchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String],
  commentcount: {
    type: Number,
    default: 0
  }
})

const BookInfo = mongoose.model('BookInfo', librarySchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      BookInfo.find({}, (err, doc) => {
        if (err) {
          console.log(err)
        }
        res.json(doc)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      const book = new BookInfo({
        title: title
      });
      if (!title) {
        res.send('missing required field title')
      }
      book.save((err, doc) => {
        if (err) {
          console.log(err)
        }
        res.json(doc)
      })
    })
    
    .delete(function(req, res){
      BookInfo.deleteMany({}, (err, doc) => {
        if (err) {
          console.log(err)
        }
        res.send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      BookInfo.findById(bookid)
        .select('-__v -commentcount')
        .exec((err, doc) => {
        if (err) {
          console.log(err);
          return res.send('no book exists')
        } else if (!doc) {
          return res.send('no book exists')
        }
        return res.json(doc)
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment')
      }
      BookInfo.findByIdAndUpdate(bookid, {
        $push: {comments: comment},
        $inc: {commentcount: 1}
      }, {new: true}, (err, doc) => {
        if (err) {
          console.log(err);
          return res.send('no book exists')
        } else if (!doc) {
          return res.send('no book exists')
        }
        return res.json(doc)
      })

      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      BookInfo.findByIdAndDelete(bookid, (err, doc) => {
        if (err) {
          console.log(err);
          return res.send('no book exists')
        } else if (!doc) {
          return res.send('no book exists')
        }
        return res.send('delete successful')
      })
    });
  
};
