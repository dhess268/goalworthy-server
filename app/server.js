const express = require("express");
const app = express();

const http = require('http');
const finalHandler = require('finalhandler');
const queryString = require('querystring');
const url = require('url');
const Router = require('router');
const bodyParser = require('body-parser');
const fs = require('fs');


// State holding variables
let goals = [];
let user = {};
let users = [];
let categories = [];

// Setup router
let myRouter = Router();
myRouter.use(bodyParser.json());

app.listen(8000, () => {
  // Load dummy data into server memory for serving
  goals = JSON.parse(fs.readFileSync("goals.json","utf-8"));
  
  // Load all users into users array and for now hardcode the first user to be "logged in"
  users = JSON.parse(fs.readFileSync("users.json","utf-8"));
  user = users[0];
  
  // Load all categories from file
  categories = JSON.parse(fs.readFileSync("categories.json","utf-8"));
})
// This function is a bit simpler...
// http.createServer(function (request, response) {
//   myRouter(request, response, finalHandler(request, response))
// }).listen(3001, () => {
//   // Load dummy data into server memory for serving
//   goals = JSON.parse(fs.readFileSync("goals.json","utf-8"));
  
//   // Load all users into users array and for now hardcode the first user to be "logged in"
//   users = JSON.parse(fs.readFileSync("users.json","utf-8"));
//   user = users[0];
  
//   // Load all categories from file
//   categories = JSON.parse(fs.readFileSync("categories.json","utf-8"));
// });


// Notice how much cleaner these endpoint handlers are...
// myRouter.get('/v1/goals', function(request,response) {
//   // Get our query params from the query string 
//   const queryParams = queryString.parse(url.parse(request.url).query)

//   const query = queryParams.query ?? ''
//   let sortBy = queryParams.sort
//   if(sortBy == 'upvotes'){
//     sortBy = 'upVotes'
//   }

//   // TODO: Do something with the query params
//   let filteredGoals = goals.filter(goal => {
//     return goal.description.toLowerCase().includes(query)
//   })

//   if(sortBy == "upVotes"){
//     filteredGoals.sort((a, b) => {
//       return b[sortBy] - a[sortBy]
//   })}
  
//   if(sortBy == "dateCreated"){
//     filteredGoals.sort((a, b) => {
//       let dateA = new Date(a[sortBy])
//       let dateB = new Date(b[sortBy])
//       return dateB - dateA
//   })}


//   // Return all our current goal definitions (for now)
//   return response.end(JSON.stringify(filteredGoals));
// });
app.get('/v1/goals', (request, response) =>{ 
    const query = request.params.query ?? ''

    let sortBy = queryParams.sort
  if(sortBy == 'upvotes'){
    sortBy = 'upVotes'
  }

  // TODO: Do something with the query params
  let filteredGoals = goals.filter(goal => {
    return goal.description.toLowerCase().includes(query)
  })

  if(sortBy == "upVotes"){
    filteredGoals.sort((a, b) => {
      return b[sortBy] - a[sortBy]
  })}
  
  if(sortBy == "dateCreated"){
    filteredGoals.sort((a, b) => {
      let dateA = new Date(a[sortBy])
      let dateB = new Date(b[sortBy])
      return dateB - dateA
  })}


  // Return all our current goal definitions (for now)
  return response.json(filteredGoals);
})

//The User Profile endpoint returns information about the Uber user that has authorized with the application.
// myRouter.get('/v1/me', function(req, res) {
//   return res.end(JSON.stringify(user))
// })
app.get('/v1/me', function(req, res) {
  return res.json(user)
})
// See how i'm not having to build up the raw data in the body... body parser just gives me the whole thing as an object.
// See how the router automatically handled the path value and extracted the value for me to use?  How nice!
// myRouter.post('/v1/me/goals/:goalId/accept', function(request,response) {
//   // Find goal from id in url in list of goals
//   let goal = goals.find((goal)=> {
//     return goal.id == request.params.goalId
//   })
//   // Make sure the data being changed is valid
//   if (!goal) {
//     response.statusCode = 400
//     return response.end("No goal with that ID found.")
//   }
//   // Add it to our logged in user's accepted goals
//   user.acceptedGoals.push(goal); 
//   // No response needed other than a 200 success
//   return response.end();
// });

app.post('/v1/me/goals/:goalId/accept', function(request,response) {
  // Find goal from id in url in list of goals
  let goal = goals.find((goal)=> {
    return goal.id == request.params.goalId
  })
  // Make sure the data being changed is valid
  if (!goal) {
    response.status(400)
    return response.end("No goal with that ID found.")
  }
  // Add it to our logged in user's accepted goals
  user.acceptedGoals.push(goal); 
  // No response needed other than a 200 success
  return response.end();
});

// myRouter.post('/me/goals/:goalId/achieve', function(req, response) {
//   let goal = goals.find(goal => {
//     return goal.id == req.params.goalId
//   })
//   // Make sure the data being changed is valid
//   if (!goal) {
//     response.statusCode = 400
//     return response.end("No goal with that ID found.")
//   }
//   user.acceptedGoals = user.acceptedGoals.filter(goal=> {
//     return goal.id != req.params.goalId
//   })
//   user.challengedGoals = user.challengedGoals.filter(goal=> {
//     return goal.id != req.params.goalId
//   })
//   user.achievedGoals.push(goal)
//   return response.end()
// })
app.post('/me/goals/:goalId/achieve', function(req, response) {
  let goal = goals.find(goal => {
    return goal.id == req.params.goalId
  })
  // Make sure the data being changed is valid
  if (!goal) {
    response.status(400)
    return response.send("No goal with that ID found.")
  }
  user.acceptedGoals = user.acceptedGoals.filter(goal=> {
    return goal.id != req.params.goalId
  })
  user.challengedGoals = user.challengedGoals.filter(goal=> {
    return goal.id != req.params.goalId
  })
  user.achievedGoals.push(goal)
  return response.end()
})

// myRouter.post('/v1/me/goals/:goalId/challenge/:userId', function(request,response) {
//   // Find goal from id in url in list of goals
//   let goal = goals.find((goal)=> {
//     return goal.id == request.params.goalId
//   })
//   // Find the user who is being challenged in our list of users
//   let challengedUser = users.find((user)=> {
//     return user.id == request.params.userId
//   })
//   // Make sure the data being changed is valid
//   if (!goal) {
//     response.statusCode = 400
//     return response.end("No goal with that ID found.")
//   }
  
//   // Add the goal to the challenged user
//   challengedUser.challengedGoals.push(goal); 
//   // No response needed other than a 200 success
//   return response.end();
// });

app.post('/v1/me/goals/:goalId/challenge/:userId', function(request,response) {
  // Find goal from id in url in list of goals
  let goal = goals.find((goal)=> {
    return goal.id == request.params.goalId
  })
  // Find the user who is being challenged in our list of users
  let challengedUser = users.find((user)=> {
    return user.id == request.params.userId
  })
  // Make sure the data being changed is valid
  if (!goal) {
    response.status(400)
    return response.send("No goal with that ID found.")
  }
  
  // Add the goal to the challenged user
  challengedUser.challengedGoals.push(goal); 
  // No response needed other than a 200 success
  return response.end();
});

// myRouter.post('/me/goals/:goalId/gift/:userId', function(req, response) {  
//   let userToGift = users.find(user => {
//     return user.id == req.params.userId
//   })
//     // Make sure the data being changed is valid
//   if (!userToGift) {
//     response.statusCode = 400
//     return response.end("No user with that ID found.")
//   }
//   let goalToGift = users.find(goal => {
//     return goal.id == req.params.goalId
//   })
//     // Make sure the data being changed is valid
//   if (!goalToGift) {
//     response.statusCode = 400
//     return response.end("No goal with that ID found.")
//   }

//   userToGift.acceptedGoals = userToGift.acceptedGoals.filter(goal=> {
//     return goal.id != req.params.goalId
//   })
//   userToGift.challengedGoals = userToGift.challengedGoals.filter(goal=> {
//     return goal.id != req.params.goalId
//   })
//   userToGift.giftedGoals.push(goalToGift)
//   return response.end()
// })
app.post('/me/goals/:goalId/gift/:userId', function(req, response) {  
  let userToGift = users.find(user => {
    return user.id == req.params.userId
  })
    // Make sure the data being changed is valid
  if (!userToGift) {
    response.status(400)
    return response.send("No user with that ID found.")
  }
  let goalToGift = users.find(goal => {
    return goal.id == req.params.goalId
  })
    // Make sure the data being changed is valid
  if (!goalToGift) {
    response.status(400)
    return response.send("No goal with that ID found.")
  }

  userToGift.acceptedGoals = userToGift.acceptedGoals.filter(goal=> {
    return goal.id != req.params.goalId
  })
  userToGift.challengedGoals = userToGift.challengedGoals.filter(goal=> {
    return goal.id != req.params.goalId
  })
  userToGift.giftedGoals.push(goalToGift)
  return response.end()
})

// myRouter.get('/v1/categories', function(req, res) {
//   // Get our query params from the query string 
//   const queryParams = queryString.parse(url.parse(req.url).query)
//   const limit = queryParams.limit ?? categories.length

//   return res.end(JSON.stringify(categories.slice(0, limit)))
// })

app.get('/v1/categories', function(req, res) {
  // Get our query params from the query string 
  const limit = req.query.limit ?? categories.length

  return res.end(JSON.stringify(categories.slice(0, limit)))
})

// myRouter.get('/v1/categories/:categoryId/goals', function(req, res) {
//   let goalsOfCategory = goals.filter(goal => {
//     return goal.categoryId == req.params.categoryId
//   })

//   if(goalsOfCategory.length < 1) {
//     res.statusCode = 400
//     return res.end("No goals of the category with that ID found.")
//   }
//   return res.end(JSON.stringify(goalsOfCategory))
// })

app.get('/v1/categories/:categoryId/goals', function(req, res) {
  let goalsOfCategory = goals.filter(goal => {
    return goal.categoryId == req.params.categoryId
  })

  if(goalsOfCategory.length < 1) {
    res.status(400)
    return res.send("No goals of the category with that ID found.")
  }
  return res.json(goalsOfCategory)
})