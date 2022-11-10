const books = [
  {
    author: 'author_Length Equal_255 FQ9hJKnVE zUHpejSmgmFk w68Qbp ToiSgO O48F VVGJy WO7aL Kzr0it6 bsQi6 scYqPJ50 JT1f0PDbF 3NNi rWz9tGfrH 00rlk4Ytq sfgIAj1 Yt1f1SH DyRM cVKwb bWB cEIRi UjC6FlWKgf bAz0B RfmF1 JyCtnH CPY IKqQpz ptRu vkzt WF2ZJL rHpDM q3N7VB KNbJbelVe5Z',
    title: 'title_Length Equal_255 FgQ9hJKnV 7zUHpejSmgmFk2w6 QbpIToiSgO O48F2V oJyLWO7aL Kzr0it6 bsQi6a cYqPJ5 TJT1f0 DbFw3 NixrW 9tGfr z00rlk4Yt HsfgIAj eYt1f1SH DyRMVcVK bqbWBGcEIRi UjC6Fl KgfkbAz0 qRfmF1 JyCtnHRCPYbI QpzEp RuJvkztQWF2Z LDrHpDMjq3N7 BLKNbJbelVe5Z',
    description: 'description Length_Equal_500 FgQ9hJKnVE7z HpejSmgmF 2w68QbpITo SgO5O48 2VVGJyLWO7 L7Kzr0it6N sQi6aVcYqPJ50 JT1f0PDbFw3NNix Wz9tGfrHz00r k4YtqHsfgIA 1eYt1f1SH DyRMVc KwbqbW GcEIRiQUj 6FlWKg kbAz BqRfmF1L yCtnHRCPYb KqQpzEp RuJvkzt WF2Z LDr pDMjq3N7 BLKNbJb lVe5b BGcEI iQUjC6FlWKg bbAz0BqRfmF1LJy tnHRCPYbI qQpzEptRuJvkz QWF2ZJLD fpDMjq3N7V LKNbJbelVe5bWBGcE RiQUjC6FlWKg kbAz0 qRfmF LJyCtnHRCPYbIK QpzEptRuJvkz QWF2Z LDrHpDM q3N7VB KNbJbel e5bWBGcE RiQUjC6 lWKgfkb z0BqRfmF1LJ CtnHRCPYbI qQpzEp RuJvk',
    id: 0
  },
  { author: 'J. R. R. Tolkien', title: 'The Lord of the Rings: The Fellowship of the Ring', description: 'The Fellowship of the Ring is the first of three volumes in The Lord of the Rings, an epic set in the fictional world of Middle-earth. The Lord of the Rings is an entity named Sauron, the Dark Lord, who long ago lost the One Ring that contains much of his power. His overriding desire is to reclaim the Ring and use it to enslave all of Middle-earth.', id: 1 },
  { author: 'J. R. R. Tolkien', title: 'The Lord of the Rings: The Two Towers', description: 'The Two Towers is the second part of J.R.R. Tolkien’s epic adventure The Lord of the Rings. One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. Frodo and his Companions of the Ring have been beset by danger during their quest to prevent the Ruling Ring from falling into the hands of the Dark Lord by destroying it in the Cracks of Doom.', id: 2 },
  { author: 'J. R. R. Tolkien', title: 'The Lord of the Rings: The Return of the King', description: 'The Return of the King is the third part of J.R.R. Tolkien’s epic adventure The Lord of the Rings. One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. The Dark Lord has risen, and as he unleashes hordes of Orcs to conquer all Middle-earth, Frodo and Sam struggle deep into his realm in Mordor.', id: 3 }
];

const BookList = () => {

  const viewBook = () => {
    console.log('view book');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="p-4 sm:px-8 flex justify-between items-center">
                <div>
                  Filters here
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >Add book</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {books.map((book) => (
              <tr key={book.id}>
                <td className='p-4 flex flex-col gap-4 sm:flex-row sm:px-8 sm:gap-8'>
                  <div>
                    <div className='flex flex-wrap gap-1 items-baseline'>
                      <p id='book-title' className='text-lg font-semibold break-words line-clamp-2'><span className='sr-only'>Title</span>{book.title}</p>
                      <p id='book-author' className='font-medium break-words line-clamp-2'><span className='sr-only'>Author</span>by {book.author}</p>
                    </div>
                    <div className='break-words line-clamp-3'>
                      <span className='sr-only'>Description</span>{book.description}
                    </div>
                  </div>
                  <div className='self-center'>
                    <button
                      type="button"
                      className="whitespace-nowrap inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                      onClick={viewBook}
                    >View book</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
