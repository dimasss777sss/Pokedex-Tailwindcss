import React, { useEffect, useState } from "react";
import axios from "axios";
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
    <div className="p-4 bg-slate-50">
      <h1 className="text-3xl font-bold mb-4 text-center ">
        <span className="animate-flash text-500 text-3xl">Poke</span>
        <span className="animate-flash text-red-500 text-3xl">dex</span>
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />

      {/* Type Filters */}
      <div className="flex gap-2 mb-4 justify-center">
        {["bug", "electric", "fire", "grass", "normal", "poison", "water"].map(
          (type) => (
            <button
              key={type}
              onClick={() => toggleTypeFilter(type)}
              className={`border-x-4 hover:bg-gray-50 px-3 py-1 rounded ${
                selectedTypes.includes(type)
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-white"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* Pokemon List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPokemons.map((pokemon, index) => (
          <div
            key={index}
            className="group relative border p-4 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={pokemon.avatar}
              alt={pokemon.name}
              className="w-24 h-24 mx-auto transform transition-transform duration-300 group-hover:translate-x-4 group-hover:scale-110"
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of{" "}
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
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default App;
