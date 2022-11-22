# Manual de Usuario


## QUICK REFERENCE MANUAL

### Ambiente de ejecución

Baky tiene dos maneras diferentes de utilizarse, puede ser en una computadora directamente desde la terminal nativa o desde un IDE adaptado para ejecutarse en un dispositivo móvil. Desafortunadamente para el segundo caso Baky aún no sale para ninguna tienda de apps por lo que actualmente se debe correr el IDE desde una computadora y conectarse mediante una red local.

En cualquier caso para poder utilizar Baky necesitamos tener instalados Node.js y NPM, existen versiones para macOS y Windows al igual que diferentes formas de poder instalarlos, para consultar una de ellas les dejamos el siguiente enlace.

https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac

Una vez instalado Node.js y NPM necesitamos clonar el repositorio de Baky, para esto tenemos que tener instalado previamente git, de nuevo les dejamos un enlace con información al respecto.

https://github.com/git-guides/install-git

Con todo lo listado previamente es hora de instalar Baky en tu computadora, se necesita correr el siguiente comando:
```
> git clone https://github.com/Ernesto1608/Baky.git
```

Una vez creada la carpeta de Baky en tu computadora se necesitan instalar todas las dependencias necesarias para su funcionamiento, para lograr esto dentro de la carpeta principal /Baky se corre el siguiente comando:
```
> npm i
```
Al término de la instalación debes tener la carpeta /node_modules dentro de la carpeta principal /Baky. 

Es importante mencionar que estas dependencias sirven únicamente para correr Baky en la terminal nativa si queremos utilizar el IDE se necesitan ejecutar los siguientes comandos:
```
//Acceder a la carpeta del IDE, en la carpeta principal /Baky ejecutar
> cd ide
//Una vez situado en la carpeta /Baky/ide ejecutar
> npm i
```

Nuevamente al término de la instalación se debe tener la carpeta /node_modules pero esta vez dentro de /Baky/ide.

Ahora viene un punto muy importante para la correcta ejecución del IDE, debido a temas de compatibilidad con React Native y las librerías utilizadas, se necesitan comentar algunas líneas de código dentro de los /Baky/node_modules las cuales son las siguientes:

Archivo - node_modules\jison\lib\jison.js
Líneas sin comentar:

![unnamed](https://user-images.githubusercontent.com/23410540/203251583-da7427dc-4e87-4d50-b15a-3e6a25613461.png)

Líneas comentadas:

![unnamed (1)](https://user-images.githubusercontent.com/23410540/203252012-c562f51c-738e-4acc-8d43-3d37456c885b.png)

Archivo - node_modules\ebnf-parser\transform-parser.js
Líneas sin comentar:

![unnamed (2)](https://user-images.githubusercontent.com/23410540/203252123-bf8e37e4-ad78-4ea7-a283-18f7e4419706.png)

Líneas comentadas:

![unnamed (3)](https://user-images.githubusercontent.com/23410540/203252173-25b47c96-1add-47e4-85a9-cb7bd6074ad4.png)

Archivo - node_modules\ebnf-parser\parser.js
Líneas sin comentar:

![unnamed (4)](https://user-images.githubusercontent.com/23410540/203252249-b0136fc9-cdd7-48b9-9460-b599d9067a07.png)

Líneas comentadas:

![unnamed (5)](https://user-images.githubusercontent.com/23410540/203252285-43ec18f0-e304-41c8-8c5a-147818382fc0.png)

Archivo - node_modules\lex-parser\lex-parser.js
Líneas sin comentar:

![unnamed (6)](https://user-images.githubusercontent.com/23410540/203252352-70b690e3-21c4-49b8-8e44-955b850cddd0.png)

Líneas comentadas:

![unnamed (7)](https://user-images.githubusercontent.com/23410540/203252394-6c69429b-c88d-4d7b-b60b-cf934cc21f06.png)

### Ejecutar Baky

La ejecución de Baky es realmente sencilla, primero veamos cómo poder ejecutarlo en la terminal nativa del ordenador.
Situado en la carpeta principal de /Baky ejecutar el siguiente comando:
```
> npm start
```
Una vez ejecutado, la terminal va a pedir por la ruta hacia el archivo del código fuente escrito en Baky, simplemente queda escribir esta ruta, presionar enter y listo Baky se ejecutará de forma automática. 

Ejemplo:

![unnamed (8)](https://user-images.githubusercontent.com/23410540/203252465-af46b639-d3d6-4235-9857-e68c1e18640d.png)

En este ejemplo yo tenía un archivo llamado FibonacciR.bky dentro de una carpeta llamada /test_functional, por lo que la ruta hacia el archivo es /test_functional/FibonacciR.bky.

Ahora veamos cómo ejecutar el IDE de Baky en tu dispositivo móvil. Para lograr esto nos ayudamos de una librería llamada Expo, es por esto que es necesario contar con la App Expo Go instalada en tu celular, esta la puedes encontrar tanto en android como en ios y luce así:

![unnamed (9)](https://user-images.githubusercontent.com/23410540/203252572-a7f3b9c5-7cc7-41ce-b3aa-d9dfdf774c14.png)

Una vez instalada la app dentro de la carpeta /Baky/ide ejecutamos el siguiente comando:
```
> npm start
```
Se desplegará un código QR en la terminal como el siguiente:

![unnamed (10)](https://user-images.githubusercontent.com/23410540/203252844-b815b354-28d0-4c12-974c-c07ddd09a3d5.png)


Solo queda escanear el código QR desde tu dispositivo móvil y la app de Expo Go se abrirá sola y te desplegará el IDE, es importante mencionar que necesitas contar con una conexión a una red local y que tanto tu computadora como tu dispositivo móvil deben de estar conectados a la misma red.

### IDE de Baky

El IDE de Baky es muy simple e intuitivo, luce de la siguiente forma:

![unnamed (11)](https://user-images.githubusercontent.com/23410540/203252956-7d216be3-b88d-426a-9791-0dbd29420948.png)
![unnamed (12)](https://user-images.githubusercontent.com/23410540/203252977-12bcef44-3603-46cb-8652-758a1677cd52.png)


Tenemos dos pestañas en la parte superior, una para escribir código y otra para mostrar el resultado en la consola y pedir los inputs si es que se tienen, de igual manera en la parte inferior de la pestaña de código tenemos el botón de correr que es el que nos permite compilar y ejecutar nuestro código en Baky, por otra parte en la pestaña de consola tenemos el botón de clear, que nos permite limpiar los logs de nuestra consola.

Así luce el código en nuestro IDE 

![unnamed (13)](https://user-images.githubusercontent.com/23410540/203253050-d1b6d047-a794-47a9-b47d-5ac978b42c1d.png)


Y así se piden los inputs y se muestran los logs en la consola

![unnamed (14)](https://user-images.githubusercontent.com/23410540/203253151-18d60058-6495-4fde-9224-6c365af992c4.png)
![unnamed (15)](https://user-images.githubusercontent.com/23410540/203253171-16625ed9-798b-4d76-bd68-8d83b17c19d0.png)


### Código en Baky

Baky cuenta con una sintaxis muy sencilla de comprender, aquí explicamos a grandes rasgos cómo programar en Baky pero si quieres aprender más te invitamos a leer la documentación del Baky que se encuentra en el repositorio de Git.

Todo programa en Baky empieza con el siguiente código:
```
Baky nombreDelPrograma;
```
En donde tu puedes nombrar como quieras a tu programa, seguido de esto tenemos una sección opcional de declaración de variables globales siendo su sintaxis y tipos soportados los siguientes:
```
var int i,j;
var double s[10],p;
var char c[2][2], w;
var string s2;
var boolean b;
```

Cómo podemos observar los tipos soportados son int, double, char, string y boolean, podemos declarar variables simples, arreglos y matrices de cada una, es importante mencionar que los indexes de los array y matrices empiezan en 0 a n-1.

Seguido de las variables globales viene una sección igual opcional de funciones parametrizadas cuya sintaxis es la siguiente:
```
//El valor de retorno de la función puede ser void,int,double,char,string,boolean
// Los parámetros son opcionales
 
function void nombreDeLaFuncion(int i, double s, char w, string m, boolean b)
//La sección de variables locales es opcional
var int q;
var char p;
{
    //Aquí se colocan los estatutos del lenguaje
}
```

Cómo podemos observar cada función tiene su ID propio, tipo de retorno, parámetros opcionales, variables locales opcionales y un bloque de estatutos, es importante mencionar que puedes definir cuantas funciones quieras dentro de esta sección.

Por último en nuestro programa tenemos la declaración de nuestra función principal, que es la que se manda a llamar al inicio de la ejecución, su sintaxis es la siguiente:
```
void Baky()
//Variables locales opcionales
int p;
{
    //Estatutos
}
```

Cómo se observa su nombre es Baky, es de tipo void y no tiene parámetros iniciales.

Pasemos a los estatutos que soporta Baky, para empezar tenemos la llamada a una función que tiene la siguiente estructura:
```
//Los parámetros a mandar deben coincidir con los esperados por la función
functionID(idVariable, idVariable, idArray[2]);
```

Como se observa llamar a una función es muy fácil y dentro de los parámetros podemos mandar variables, constantes o valores dentro de un array o matriz.

El siguiente estatuto es el de el return:
```
return exp;
```

El return se utiliza para regresar un valor esperado en una función con tipo diferente a void, podemos regresar el valor resultante de una expresión.

El siguiente estatuto es el read:
```
read(s,r[1]);
```

Este estatuto nos sirve para recibir valores desde la consola y guardarlos en una variable simple o array.

El siguiente estatuto es el write:
```
write(exp1, exp2);
```

Este estatuto nos sirve para escribir valores en la consola, podemos desplegar cualquier valor resultante de una expresión.

El siguiente estatuto es el if:
```
//El else es opcional
if(booleanExp){
    //Estatutos
} else {
    //Estatutos
}
```

Este estatuto hace una comparación inicial y de acuerdo con el resultado ejecuta el primer o el segundo bloque de estatutos, siendo el segundo bloque totalmente opcional y en dado caso solo ejecutaría el primer bloque si la condición se cumple.

El siguiente estatuto es el while:
```
while(booleanExp){
    //Estatutos
}
```

Este estatuto hace una comparación inicial y ejecuta el bloque de estatutos de manera cíclica mientras la comparación resulte verdadera.

El siguiente estatuto es el for:
```
from idVariable to expIntODouble do {
    //Estatutos
}
```

Este estatuto requiere de una variable de tipo int o double de comienzo y una expresión que resulte en un int o double de fin, ejecuta de manera iterativa el bloque de estatutos mientras que el valor de idVariable sea menor que el de expIntODouble incrementando en uno el valor de idVariable al final de cada iteración.

El siguiente estatuto es el de asignación:
```
idVariable = exp;
```

Este estatuto asigna el valor resultante de la expresión al idVariable.

A lo largo del código hemos utilizado el término de expresión así que vamos a explicarlo más a detalle. Una expresión es una secuencia de operandos y operadores que al evaluarse de acuerdo a una jerarquía establecida dan un resultado de tipo variable de acuerdo a la expresión.

En el caso de Baky tenemos operadores aritméticos, relacionales y lógicos, siendo su definición y jerarquía la siguiente:

![Capture23](https://user-images.githubusercontent.com/23410540/203253883-b3304b6c-9df4-4e9d-9c3e-8285dc3d42d2.PNG)

Por otro lado los operandos en Baky pueden ser cualquiera de los siguientes:

Variable simple o no atómica
Llamada a una función con tipo de retorno
Constante entera
Constante double
Constante char
Constante string
Constante boolean

Esto permite que en Baky se puedan evaluar expresiones como las siguientes:
```
1*2.5+23--5/idVariable <= idArray[2]*idMatrix[1][0]
 
"salmon" == "ramon" || false && true && functionBoolean(int i)
```

Ejemplo de Código y Videos Demo

A continuación dejamos el ejemplo de un código que calcula el enésimo número de la serie de fibonacci de manera recursiva.
```
Baky FibonacciR;
 
function int fibonacci(int n){
    if(n<=2) {return 1;}
    return fibonacci(n-2)+fibonacci(n-1);
}
 
void Baky()
var int n;
{
    read(n);
    n = fibonacci(n);
    write(n);
}
 
// Serie de fib: 1 1 2 3 5 8 13 21 34 55 89 144 233
```

Demo Baky en Terminal: https://youtu.be/Cl5OvhqXdUo

Demo IDE de Baky: https://youtu.be/iTIddhkHQC4
