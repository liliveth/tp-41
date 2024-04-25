const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
    add: async (req, res) => {
        try {
            const allGenres = await Genres.findAll();
            const allActors = await Actors.findAll();
    
            res.render(path.resolve(__dirname, '..', 'views', 'moviesAdd'), {
                allGenres,
                allActors,
            });
        } catch (error) {
            res.send(error);
        }
    },    
    create: async (req, res) => {
        console.log("Este es el body",req.body)
        try {
            const movie = await db.Movie.create(req.body)
            return res.status(200).json({
                data: movie,
                status: 200,
                created: "ok",
            });
            
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    delete: function (req, res) {
        let movieId = req.params.id;
        db.Movie.findByPk(movieId)
            .then((Movie) => {
                return res.render(
                    path.resolve(__dirname, "..", "views", "moviesDelete"),
                    { Movie }
                );
            })
            .catch((error) => res.send(error));
    },
    destroy: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if(!Number.isInteger(id)){
                throw new Error('El ID indicado debe ser un número entero.')
            }
            const movie = await db.Movie.findByPk(id)
            if(!movie){
                throw new Error(`La pelicula con el ID ${id} no existe.`)
            } else {
                await movie.destroy({
                    where: { id: req.params.id },
                    force: true,
                }) 
                        return res.json({
                            deleted: "ok",
                        });
            }
        } catch (error) {
            console.log(error.message);
            return res.status(400).json(error.message)
        }
    },
};

module.exports = moviesController;