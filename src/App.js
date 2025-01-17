import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPokemons();
  }, []);
  const fetchPokemons = async () => {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100"
    );
    const pokemonData = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);
        return {
          name: details.data.name,
          avatar: details.data.sprites.front_default,
          types: details.data.types.map((type) => type.type.name),
          stats: details.data.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })),
        };
      })
    );
    setPokemons(pokemonData);
  };
  const filteredPokemons = pokemons
    .filter((pokemon) => pokemon.name.includes(search.toLowerCase()))
    .filter((pokemon) =>
      selectedTypes.length === 0
        ? true
        : pokemon.types.some((type) => selectedTypes.includes(type))
    );
  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const toggleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold flex justify-center items-center">
          <motion.span
            className="text-blue-500"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Poke
          </motion.span>
          <motion.span
            className="text-red-500"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            dex
          </motion.span>
        </h1>
      </div>

      <motion.div
        className="flex justify-center items-center mb-4"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <motion.input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded p-2 w-1/2 sm:w-1/3  text-center focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
          whileFocus={{
            scale: 1.05,
            boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.3)",
          }}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-wrap gap-4 mb-4 justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.1 }}
      >
        {["bug", "electric", "fire", "grass", "normal", "poison", "water"].map(
          (type, index) => (
            <motion.button
              key={type}
              onClick={() => toggleTypeFilter(type)}
              className={`border px-3 py-1 text-sm sm:text-base rounded font-semibold hover:bg-blue-400 ${
                selectedTypes.includes(type)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 150,
              }}
            >
              {type}
            </motion.button>
          )
        )}
      </motion.div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPokemons.map((pokemon, index) => (
          <motion.div
            key={index}
            className="group relative border p-4 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.img
              src={pokemon.avatar}
              alt={pokemon.name}
              className="w-24 h-24 mx-auto"
              animate={{
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1.5,
              }}
            />
            <h2 className="text-xl font-bold">{pokemon.name}</h2>
            <div className="flex gap-2 my-2">
              {pokemon.types.map((type, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded text-white ${
                    type === "fire"
                      ? "bg-orange-500"
                      : type === "water"
                      ? "bg-blue-500"
                      : type === "grass"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
            <div>
              {pokemon.stats.map((stat, idx) => (
                <p key={idx}>
                  <span className="font-bold">{stat.name}:</span> {stat.value}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagin. */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev.
          </button>
          <span className="mx-2">
            P. {currentPage} of{" "}
            {Math.ceil(filteredPokemons.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredPokemons.length / itemsPerPage)
                )
              )
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border border-gray-300 rounded p-1"
        >
          <option value={10}>10 pages</option>
          <option value={20}>20 pages</option>
          <option value={50}>50 pages</option>
        </select>
      </div>
    </div>
  );
};

export default App;
