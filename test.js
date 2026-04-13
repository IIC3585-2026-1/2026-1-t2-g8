const { query } = require('./query-clean')

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

// --- where ---
console.log("=== where: age > 25 ===")
console.log(query(users).where(u => u.age > 25).execute())

// --- select ---
console.log("\n=== select: name, city ===")
console.log(query(users).select(['name', 'city']).execute())

// --- where + select ---
console.log("\n=== where + select ===")
console.log(query(users).where(u => u.age > 25).select(['name', 'city']).execute())

// --- orderBy ---
console.log("\n=== orderBy age asc ===")
console.log(query(users).orderBy('age', 'asc').execute())

// --- groupBy ---
console.log("\n=== groupBy city ===")
console.dir(query(users).groupBy('city').execute(), { depth: null })

// --- groupBy + aggregate ---
function average(arr) {
    if (arr.length === 0) return 0
    return arr.reduce((a, b) => a + b, 0) / arr.length
}

console.log("\n=== groupBy + aggregate ===")
console.log(query(users).groupBy('city').aggregate({
    count: items => items.length,
    avgAge: items => average(items.map(x => x.age))
}).execute())

// --- limit ---
console.log("\n=== limit 3 ===")
console.log(query(users).limit(3).execute())

// --- skip ---
console.log("\n=== skip 3 ===")
console.log(query(users).skip(3).execute())

// --- distinct ---
console.log("\n=== distinct city ===")
console.log(query(users).distinct('city').execute())

// --- ALL: where + select + orderBy + groupBy + aggregate + limit ---
console.log("\n=== ALL: where + groupBy + aggregate + orderBy + select + limit ===")
console.log(
    query(users)
        .where(u => u.age > 20)
        .groupBy('city')
        .aggregate({
            count: items => items.length,
            avgAge: items => average(items.map(x => x.age))
        })
        .orderBy('avgAge', 'desc')
        .select(['city', 'count', 'avgAge'])
        .limit(2)
        .execute()
)
