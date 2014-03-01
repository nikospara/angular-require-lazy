"use strict";

var obj = {
  internal : {}
};

Object.freeze(obj);
obj.internal.a = "aValue";

console.log(obj.internal.a); // "aValue"

// To make obj fully immutable, freeze each object in obj.
// To do so, we use this function.

function deepFreeze (o) {
  var prop, propKey;
  Object.freeze(o); // First freeze the object.
  for (propKey in o) {
    prop = o[propKey];
    if (!o.hasOwnProperty(propKey) || !(typeof prop === "object") || Object.isFrozen(prop)) {
      // If the object is on the prototype, not an object, or is already frozen, 
      // skip it. Note that this might leave an unfrozen reference somewhere in the
      // object if there is an already frozen object containing an unfrozen object.
      continue;
    }

    deepFreeze(prop); // Recursively call deepFreeze.
  }
}

var obj2 = {
  internal : {}
};

deepFreeze(obj2);
obj2.internal.a = "anotherValue";
console.log(obj2.internal.a); // undefined
