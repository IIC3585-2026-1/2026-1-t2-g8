# README

## Explicación de la función `query`

La idea de esta función es que retorne **una copia de `data`**, ya que en el enunciado se especifica que **no está permitida la mutación de variables** (no modificar arrays u objetos originales).

Además, la función está implementada como **una clausura**, es decir, **no expone directamente el valor de la copia de `data`**.

(Nota: inevitablemente esta función **debe retornar un objeto**, porque es la única forma de poder encadenar llamadas del tipo `.funcion()` en la respuesta. Por lo tanto, ese objeto **debe tener métodos como `where`, `select`, etc.**)

---

## Copia de los datos

Se crea una copia de `data` utilizando `map`:

- `map` siempre devuelve **un nuevo array** sobre el cual opera.
- Dentro de `map`, se recibe cada elemento del array y se ejecuta una función sobre él.
- En este caso, la función **copia cada elemento expandiendo sus atributos en un nuevo objeto**.

---

## `select` y uso de `reduce`

En `select`, se utiliza `reduce` para construir un nuevo objeto con los atributos solicitados.

El funcionamiento es:

- `reduce` parte con un **valor inicial para el acumulador**, que en este caso es `{}`.
- En cada iteración se retorna un nuevo objeto que:
  - contiene los atributos ya acumulados usando el **operador de expansión (`...`)**
  - agrega el nuevo atributo correspondiente.

De esta manera:

- Se recorre el **array de atributos**
- Se crea un **nuevo objeto solo con esos atributos**
- Esto se hace **para cada elemento del array**, filtrando así los campos.

En JavaScript, cuando el nombre del atributo está en una variable string, se puede acceder usando **`[atributo]`**.

---

## `orderBy`

`orderBy` permite ordenar los resultados.

- El parámetro `orden` puede ser `"asc"` o `"desc"`.
- Se utiliza `slice()` antes de `sort()` para **copiar el array original y evitar modificarlo**.

---

## `groupBy`

Agrupa los elementos según un atributo y retorna un **array de objetos agrupados**.

Internamente:

1. Se utiliza `reduce` para construir un objeto donde cada clave representa un grupo.
2. Luego ese objeto se transforma en un array usando `Object.entries`.

Cada grupo queda con la forma:

```
{
atributoAgrupado: valor,
items: [ …elementosDelGrupo ]
}
```

---

## `aggregate`

`aggregate` está escrito para usarse **después de `groupBy`**.

En ese caso cada elemento tiene la forma:

```
{
atributoAgrupado: valor,
items: [ …elementosDelGrupo ]
}
```

El motivo de hacerlo de esta forma es **seguir el mismo patrón que SQL**:

1. `groupBy` crea los grupos
2. `aggregate` aplica funciones de agregación sobre cada grupo

Las funciones de agregación (como `count`, `avg`, etc.) se recorren y se construye un objeto con los resultados correspondientes a cada grupo.

---

## `limit`

`limit(n)` retorna solo los **primeros `n` elementos** del resultado.

## `skip`

`skip(n)` se salta los **primeros `n` elementos** y retorna todos los siguientes.

## `distinct`

`distinct(field)` elimina los elementos cuyo valor en el campo field ya apareció antes en el array, conservando solo la primera aparición.

Diferencia con SQL:

En SQL, DISTINCT requiere que **todos** los campos sean iguales para eliminar una fila. En esta implementación, `distinct(field)` elimina por un campo específico, aunque el resto de los campos sean distintos.

Ejemplo:

```
// Entrada                                                                   
{ id: 1, name: 'Ana',   city: 'Santiago' }   // ← se queda
{ id: 2, name: 'Luis',  city: 'Valparaíso' } // ← se queda
{ id: 3, name: 'Carla', city: 'Santiago' }   // ← se elimina, city ya apareció

// Resultado
{ id: 1, name: 'Ana',  city: 'Santiago'   }
{ id: 2, name: 'Luis', city: 'Valparaíso' } 
```
Ana y Carla tienen distinto id y name, pero como city ya apareció, Carla se elimina.

---

## `execute`

`execute()` simplemente **retorna la copia actual de los datos (`copia`)**, que corresponde al resultado final después de aplicar las operaciones encadenadas.
