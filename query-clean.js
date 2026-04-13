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

module.exports = { query }