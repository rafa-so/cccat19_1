# Objetivo
A Clean Architecture é um modelo que tem como objetivo o `desacoplamento entre as regras de negócio, ou domínio, da aplicação e os recursos externos como frameworks e banco de dados`.

Permitir o desenvolvimento da aplicação isolada de runtime devices (file system, database, framework)

O centro da aplicação não são as tecnologias que serão usadas, e sim os casos de uso (o motivo pelo qual o usuário vai usar).

# Clean Achitecture

## Camadas
 - Entreprise Business Rules
 - Application Business Rules
 - Interface Adapters
 - Frameworks & Drivers

> Da camada mais interna da aplicação e isolada, da mais externa

### Dependency Rule
Quem está dentro da camada não conhece quem está fora, e quem está fora depende de quem está na camada abaixo

## Use Case

Os use cases `expõe o comportamento demandado pelos drivers (atores)`, e <u>orquestram as entidades e os recursos externos como banco de dados , APIs, Filas</u>.

![alt text](image.png)

> Lista de `use cases` que estão expostos e cada cliente consome o que quer.

--- 

### CRUD x `Use Case`
Uma coisa não tem exatamente relação com a outra. Dependedo do problema que está tentando resolver, não tem uma operação de CRUD explícita. 

> A confusão também acontece a partir da `API RESTful`. Este modelo não obriga a ter exatamente um crud para cada um dos recursos. Na verdade, não é nada disso que a `especificação` do modelo fala.

O `use case` é mais uma especialidade de cada umas das operações envolvendo CRUD. Podemos ter uma série de regras para executar uma atualização de dados de um produto. Podemos ter algumas formas de atualização de pequenos dados de um mesmo produto. Assim como os outros `use cases`. 

