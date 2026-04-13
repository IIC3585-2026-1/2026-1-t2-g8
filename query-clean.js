function query(data) {

    const copia = data.map(item => ({...item}))
    
    return {
        where: (funcionDeFiltro) => { return query(copia.filter(funcionDeFiltro)) },
        select: (arrayDeAtributos) => { 

            const filterAtributes = (item) => {
                return arrayDeAtributos.reduce((acumulador, atributo) => {
                    return { ...acumulador, [atributo]: item[atributo] }
                    }, {})  
            }

            return query(
                copia.map(item => filterAtributes(item)                    
                )                
            )
        },        

        orderBy: (atributo, orden) => {
            return query(copia.sort((a, b) => {
                if (orden === "asc") {
                    return a[atributo] - b[atributo]
                } else {
                    return b[atributo] - a[atributo]
                }
            }))
        },
        groupBy: (atributo) => {
            const gruposPorKey = copia.reduce((acumulador, item) => {
                const key = item[atributo]
                const grupoActual = acumulador[key] || []
                return {
                    ...acumulador,
                    [key]: [...grupoActual, { ...item }] 
                }
            }, {})

            const gruposComoArray = Object.entries(gruposPorKey).map(([key, items]) => ({
                [atributo]: key,
                items
            }))

            return query(gruposComoArray)
        },
        aggregate: (aggregations) => {            

            const applyAggregations = (items, aggregations) => {                    
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

console.log(query(users).where(u => u.age > 25).execute())

// const result = query(users).where(u => u.age > 25).select(['name', 'city']).groupBy('city').execute()
// console.dir(result, { depth: null })

// console.dir(query(users).groupBy('city').execute(), {depth: null})
// console.log("\n\n")

// --- Prueba con aggregate ---
// console.dir(query(users).groupBy('city').execute(),{depth: null})

// function average(arr) {
//   if (arr.length === 0) return 0
//   return arr.reduce((a,b) => a + b, 0) / arr.length
// }
// console.log("\n\n")
// console.log(query(users).groupBy('city').aggregate({count: items => items.length, avgAge: items => average(items.map(x => x.age))}).execute())

// --- Prueba con limit ---
// console.dir(query(users).where(u => u.age > 25).groupBy('city').limit(1).execute(), { depth: null })