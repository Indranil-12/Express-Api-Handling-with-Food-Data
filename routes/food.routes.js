const express = require('express');

// Create express Router
const foodRouter = express.Router();

// Import Food Data
const foodData = require('../database/db.module');

// Create the following endpoints using node.js + express framework.
// 1)Request Type : GET
//   displaying all food information.
foodRouter.get('/all', (req, res) => {
    res.status(200).json(foodData);
})

// 2)Request type : GET
//   display food items depends on price index [startPrice & endPrice will be provided by frontend users]
foodRouter.get('/search/:st/:end', (req, res) => {
    let searchItem = foodData.filter(item => {
        if (req.params.st > req.params.end) {
            if (item.price >= req.params.end && item.price <= req.params.st) {
                return true;
            }
        } else {
            if (item.price <= req.params.end && item.price >= req.params.st) {
                return true;
            }
        }
    })
    if (req.params.st < 0 || req.params.end < 0) {
        res.status(200).json({ "message": "Don't put -ve sign" });
    } else if (searchItem != 0) {
        res.status(200).json(searchItem);
    } else {
        res.status(200).json({ "message": "Invalid syntax or data not found" });
    }
})

// 3)Request TYPE : GET
//   sort all food items by their price in descending order.
foodRouter.get('/sort/desc', (req, res) => {
    let sortFoodData = foodData.sort((a, b) => b.price - a.price);
    res.status(200).json(sortFoodData);
})
// 4)Request Type : GET
//   show all chicken related items and mutton related items.
//   calculate total price of each categories.
foodRouter.get('/show/chicken-mutton',(req,res)=>{
    let category=['chicken','mutton'];
    let categoryData=category.map(type=>{
        let addByCategory=foodData.filter(item=>item.food.toLowerCase().includes(type));
        let totalPrice=0;
        addByCategory.forEach((item)=>{
            totalPrice+=item.price;
        })
        return{ 
            type: type,
            data: addByCategory,
            total_Price:totalPrice
        }
    })
    res.status(200).json(categoryData);
})



// 5)Request Type : POST
//   add a new food item to existing food model.
const randomId = () => {
    return Math.floor(Math.random() * 999);
}

foodRouter.post('/send/newitem', (req, res) => {
    let newData = {
        "food_id": randomId(),
        "food": req.body.pfood || null,
        "price": req.body.pprice || null
    }

    if (newData.food != null && newData.price != null) {
        foodData.push(newData);
        res.status(200).json({
            "message": "Data Send Succesfully",
            "send Food Data": newData,
            "Updated Food Items": foodData,
        })
    } else {
        res.status(200).json({ "message": "Problem occure in sending Data" })
    }
})

// 6)Request Type : PUT OR PATCH
//   Update pre existing food item depends on food id.
foodRouter.all('/update/:id', (req, res) => {
    if (req.method == "PUT" || req.method == "PATCH") {
        let findFoodItem = foodData.find(item => item.food_id == req.params.id);
        if (findFoodItem) {
            findFoodItem.food = req.body.pfood;
            findFoodItem.price = req.body.pprice;
            res.status(200).json({
                "message": "Updated Successfully",
                "updated Item": findFoodItem,
                "Updated List": foodData
            })

        } else {
            res.status(200).json({ "message": "Item not Found" });
        }
        // console.log(findFoodItem);
    } else {
        res.status(200).json({ "message": "Select a valid method" });
    }
})


// 7)Request Type : DELETE
//   delete a food item depends on food_id.
foodRouter.delete('/delete/:item_id', (req, res) => {
    let deletedData = foodData.findIndex(item => item.food_id == req.params.item_id);
    // console.log(deletedData);
    if (deletedData > -1) {
        // console.log(deletedData,foodData);
        foodData.splice(deletedData, 1);
        res.status(200).json({
            "message": "Item Deleted Successfully",
            "deleted Data": foodData[deletedData],
            "Updated List": foodData,
        })
    } else {
        res.status(200).json({ "message": "Problem occure in deleting item or item not found" });
    }
})



module.exports = foodRouter;
console.log("Food Router exported");
