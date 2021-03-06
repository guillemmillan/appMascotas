const express = require("express");
const router = express.Router();
const Place = require("../models/Place.model.js");
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");



router.get("/signup", async (req, res) => res.render("auth/signup"));

router.get("/aboutus", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});



//Favourite route

router.get("/favorites", async (req, res) => {
  try {

    const {
      _id: userId
    } = req.session.currentUser
    console.log(req.session.currentUser)
    const user = await User.findById({
      _id: userId
    }).populate('parques').lean()
    console.log(user)
    res.render("users/favorites", user);

  } catch (error) {
    console.log(error)
  }

});

router.post("/favorites/:placeId", async (req, res) => {
  const {
    _id: userId
  } = req.session.currentUser
  const {
    placeId
  } = req.params
  const user = await User.findById({
    _id: userId
  }).lean()
  const parque = user.parques.find((parqueId) => {
    console.log("ID", parqueId, placeId)
    return parqueId == placeId
  })
  console.log("Parque", parque)

  if (!parque) {
    const agregarParque = await User.findByIdAndUpdate({
      _id: userId
    }, {
      $push: {
        parques: placeId
      }
    }, {
      new: true
    }) // act del user.parque para que se muestre en la db
    console.log('SE HA AGREGADO UN PARQUE A FAVORITO', agregarParque.parques)
  } else {
    const quitarParque = await User.findByIdAndUpdate({
      _id: userId
    }, {
      $pull: {
        parques: placeId
      }
    }, {
      new: true
    })
    console.log('Parque quitado con éxtio GUILLLEM!', quitarParque)
  }
  res.redirect("/favorites")
})

// Pets route

router.get('/pets', async (req, res) => {
  try {

    // const {
    //   _id: userId
    // } = req.session.currentUser
    // console.log(req.session.currentUser)

    // const pets = await Pet.find({})
    // res.render('users/pets', {
    //   petsId: pets,
    //   user: req.session.currentUser
    // })


    const user = await User.findById(
      req.session.currentUser._id
    ).populate('pets').lean()
    console.log('USUARIO', user)
    res.render("users/pets", user);

  } catch (error) {
    console.log(error)
  }

});
// try {
//   const pets = await Pet.findById(req.params.petsId)
//   res.render('users/pets', {
//     petsId: pets,
//     user: req.session.currentUser
//   })
// } catch (error) {
//   console.log('ERROR AL HACER LA RUTA', error)
// }
//})


router.get('/pet-add', (req, res) => {
  res.render('users/pet-add', {
    user: req.session.currentUser
  })
})

// router.post("/pets-add", async (req, res) => {

//   // const {
//   //   _id: userId
//   // } = req.session.currentUser

//   const {
//     name,
//     age,
//     breed
//   } = req.body;
//   const newPet = await new Pet({
//     name,
//     age,
//     breed
//   })
//   newPet.save()
//     .then((pet) => {
//       res.redirect('users/pets');
//     })
//     .catch((error) => {
//       console.log("error", error)
//     })

// })
router.post('/pet-add', async (req, res) => {
  const {
    _id: userId
  } = req.session.currentUser

  const {
    name,
    age,
    breed
  } = req.body;
  const newPet = await Pet.create({
    name,
    age,
    breed
  })
  console.log(newPet)
  const updateUser = await User.findByIdAndUpdate({
    _id: userId
  }, {
    $push: {
      pets: newPet._id
    }
  }, {
    new: true
  })
  console.log(updateUser.pets)
  res.redirect('/pet-add')
})

//Place details

router.get('/:placeId', async (req, res) => {
  try {
    const placeDetails = await Place.findById(req.params.placeId)
    res.render('placeDetails', {
      place: placeDetails,
      user: req.session.currentUser
    })
  } catch (error) {
    console.log('ERROR AL HACER LA RUTA', error)
  }
})


router.get("/", async (req, res) => {
  try {
    const allPlaces = await Place.find().lean();
    const user = req.session.currentUser;
    res.render("index", {
      places: allPlaces.map((place) => ({
        user,
        ...place
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});




//Place details alternative with promises

// router.get("/:placeId", (req, res) => {
//   Place.findById(req.params.placeId)
//     .then(placeDetails => {
//       console.log("Pasando places", placeDetails)
//       res.render("placeDetails", {
//         userInSession: req.session.currentUser,
//       });
//     });

// })



module.exports = router;