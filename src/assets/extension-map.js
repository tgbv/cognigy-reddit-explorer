// auto-generated
// do not edit
module.exports = {
  connections: [],
  nodes: {
  "LoadComments/Error": {
    "childrenType": [],
    "parentType": "LoadComments"
  },
  "LoadComments/Success": {
    "childrenType": [],
    "parentType": "LoadComments"
  },
  "LoadComments": {
    "childrenType": [
      "LoadComments/Error",
      "LoadComments/Success"
    ]
  },
  "LoadPosts/Error": {
    "childrenType": [],
    "parentType": "LoadPosts"
  },
  "LoadPosts/NotFound": {
    "childrenType": [],
    "parentType": "LoadPosts"
  },
  "LoadPosts/Success": {
    "childrenType": [],
    "parentType": "LoadPosts"
  },
  "LoadPosts": {
    "childrenType": [
      "LoadPosts/Error",
      "LoadPosts/NotFound",
      "LoadPosts/Success"
    ]
  }
},
}