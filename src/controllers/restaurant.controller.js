const service = require("../services/restaurant.service")

exports.createRestaurants = async (req, res, next) => {
    try{
        const newRestaurant = await service.create({
        ...req.body,
        owner: req.user._id
        });
        return res.json({success: true, data: newRestaurant });

    } catch (err){
       if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "You already have a restaurant with this name",
    });
  } 
    return next(err)
    }
 };

exports.getAllRestaurants = async (req, res, next) => {
    try{
        const restaurants = await service.findAll(req.query);
        res.json({success: true, data: restaurants });

    } catch (err){
        return next(err)
    }
}

exports.getRestaurantById = async (req, res, next) => {
    try{
const restaurant = await service.findById(req.params.id);


if(!restaurant) {
    return res.status(404).json({ success: false, message: "Not found" });
}
res.json({success: true, data: restaurant});
    } catch (err) {
      return next(err)
    }
}

exports.updateRestaurant = async (req, res, next) => {
try {
const restaurant = await service.findById(req.params.id);
if (!restaurant) {
return res.status(404).json({ success: false, message: "Not found" });
}
// Admins bypass the check; owners must own this restaurant
const isOwner = restaurant.owner?.toString() === req.user._id.toString();
if (req.user.role !== "admin" && !isOwner) {
return res.status(403).json({ success: false, message: "Not your restaurant" });
}
const updated = await service.update(req.params.id, req.body);
res.json({ success: true, data: updated });
} catch (err) {
return next(err);
}
};

exports.deleteRestaurant = async (req, res, next) => {
    try {
const removeRestaurant = await service.findById(req.params.id);
if(!removeRestaurant) {
return res.status(404).json({ success: false, message: "Not found" });  
}

const theOwner = removeRestaurant.owner?.toString() === req.user._id.toString();
if (req.user.role !== "admin" && !theOwner) {
return res.status(403).json({ success: false, message: "Not your restaurant" });
}
const remove = await service.remove(req.params.id);
res.json({ success: true, data: remove });
    } catch (err){
        next(err)
    }
};
