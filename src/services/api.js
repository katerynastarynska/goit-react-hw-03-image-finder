
// export const getImages = async searchQuery => {
//     const response = await axios.get(`https://pixabay.com/api/?q=${searchQuery}&page=1&key=35341635-e8056e87c32d0b59c4040edf5&image_type=photo&orientation=horizontal&per_page=12`)
//     return response.data.hits;
// }


const BASE_URL = "https://pixabay.com/api";
const KEY = '35341635-e8056e87c32d0b59c4040edf5';

export const getImages = async ({ searchQuery, limit, currentPage }) => {

    //   const params = new URLSearchParams({
    //     limit,
    //     currentPage,
    //     q: searchQuery,
    //   });

    const response = await fetch(`${BASE_URL}/?q=${searchQuery}&page=${currentPage}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=${limit}`);
console.log(currentPage)
    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
};