// Explicacion de la funcion query
// La idea de esta funcion, es que retorne una copia de data, ya que en el enunciado dicen que no esta permitida la mutación de variables (no modificar arrays/objetos originales)
// Al mismo tiempo esta funcion si o si debe retornar un objeto, porque es la unica forma de poner .funcion() en la respuesta
// Ese objeto por ende debe tener un atributo where por ejemplo

function query(data) {

    const copia = data.map(item => ({...item})) // Copia de data
    // Se copia asi pq map devuelve siempre un nuevo array sobre el cual opera y dentro de map se pasa siempre los elementos de ese array y se ejecuta una funcion sobre ese elemento 
    // En este caso la funcion es copiar ese elemento expandiendo sus atributos en un nuevo objeto
    
    return {
        where: (funcionDeFiltro) => { return query(copia.filter(funcionDeFiltro)) },
        select: (arrayDeAtributos) => { 
            return query(
                copia.map(item => 
                    arrayDeAtributos.reduce((acumulador, atributo) => {
                        return { ...acumulador, [atributo]: item[atributo] }
                        }, {})
                    // Aca el reduce lo que hace es toma un valor inicial para acumulador que se declara despues de la "," aca es {}
                    // Y luego cada return actualiza el valor de acumulador a lo que se retorna
                    // Entonces basicamente recorre el array de atributos y crea un nuevo objeto con los atributos que ya venian usando el operador de expansion y ademas agrega el nuevo
                    // En js si el atributo se declara como string se puede acceder con [atributo]
                    // Y alfinal hace esto para cada item entonces asi lo filtra.
                )
            )
        },
        orderBy: (atributo, orden) => {
            // orden = "asc" | "desc"
            return query(copia.slice().sort((a, b) => { // slice() es para hacer una copia del array original y no modificarlo
                if (orden === "asc") {
                    return a[atributo] - b[atributo]
                } else {
                    return b[atributo] - a[atributo]
                }
            }))
        },
        groupBy: (atributo) => {
            // Agrupa por atributo y retorna un array de objetos.
            const gruposPorKey = copia.reduce((acumulador, item) => {
                const key = item[atributo]
                const grupoActual = acumulador[key] || []
                return {
                    ...acumulador,
                    [key]: [...grupoActual, { ...item }] // Agrega el item al grupo actual
                }
            }, {})

            // Convertimos el objeto de grupos a un array de objetos con el atributo y el array de items
            const gruposComoArray = Object.entries(gruposPorKey).map(([key, items]) => ({
                [atributo]: key,
                items
            }))

            return query(gruposComoArray)
        },
        aggregate: (aggregations) => {
            // aggregate está escritp para usarse después de groupBy.
            // En ese caso cada elemento de 'copia' tiene la forma:
            // { atributoAgrupado: valor, items: [ ...elementosDelGrupo ] }

            // El motivo de hacerlo de esta forma es para seguir el mismo patrón que SQL:
            // primero groupBy crea grupos y luego aggregate aplica/calcula funciones sobre cada grupo.

            const applyAggregations = (items, aggregations) => {
                // Recorre las funciones de agregación (count, avg, etc.)
                // y construye un objeto con los resultados para ese grupo.
                const aggregationsArray = Object.entries(aggregations)
                return aggregationsArray.reduce(
                    (acc, [name, fn]) => ({ ...acc, [name]: fn(items) }),
                    {}
                )
            }

            const aggregateGroup = (group, aggregations) => {
                const { items, ...key } = group
                return { ...key, ...applyAggregations(items, aggregations) }
            }

            return query(copia.map(group => aggregateGroup(group, aggregations)))
        },

        limit: (n) => {
            return query(copia.slice(0, n))
        },

        execute: () => {
            return copia
        }
    }
}

const users = [
    { id: 1, name: 'Ana', age: 25, city: 'Santiago' },
    { id: 2, name: 'Luis', age: 35, city: 'Valparaíso' },
    { id: 3, name: 'Carla', age: 32, city: 'Santiago' },
    { id: 4, name: 'Pedro', age: 28, city: 'Concepción' },
    { id: 5, name: 'Vicente', age: 19, city: 'Santiago' },
    { id: 6, name: 'Maria', age: 46, city: 'Valparaíso' },
    { id: 7, name: 'Antonia', age: 66, city: 'Santiago' },
    { id: 8, name: 'Emilia', age: 80, city: 'Concepción' },
    { id: 9, name: 'Juan', age: 9, city: 'Santiago' },
    { id: 10, name: 'Jorge', age: 7, city: 'Valparaíso' },
    { id: 11, name: 'Carmen', age: 45, city: 'Concepción' },
    { id: 12, name: 'Fernando', age: 34, city: 'Santiago' },
]

// console.log(query(users).where(u => u.age > 25).select(['name', 'city']).execute())
// console.log(query(users).where(u => u.age > 25).orderBy('age', 'asc').select(['name', 'city']).execute())

// const result = query(users).where(u => u.age > 25).select(['name', 'city']).groupBy('city').execute()
// console.dir(result, { depth: null })


// function average(arr) {
//   if (arr.length === 0) return 0
//   return arr.reduce((a,b) => a + b, 0) / arr.length
// }

// // Prueba con aggregate
// console.log(query(users).groupBy('city').aggregate({count: items => items.length, avgAge: items => average(items.map(x => x.age))}).execute())

// Prueba con limit
// console.dir(query(users).where(u => u.age > 25).groupBy('city').limit(1).execute(), { depth: null })