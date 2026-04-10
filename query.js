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
        execute: () => {return copia}
    }
}

const users = [
    { id: 1, name: 'Ana', age: 25, city: 'Santiago' },
    { id: 2, name: 'Luis', age: 35, city: 'Valparaíso' },
    { id: 3, name: 'Carla', age: 32, city: 'Santiago' },
    { id: 4, name: 'Pedro', age: 28, city: 'Concepción' }
]

console.log(query(users).where(u => u.age > 25).select(['name', 'city']).execute())