# Aula 04

## Domain-Driven Design - Parte 01

### O que é `Domínio`?
`O domínio é o problema, em termos de negócio,` que precisa ser resolvido <u>independente da tecnologia que será utilizada</u>.

> O domínio não tem relação apenas ao projeto em si, mas como a organização trabalha e enxerga o problema a ser resolvido como um todo.

![Domínio](image.png)

#### Linguagem Ubíqua
É a tentativa de aproximar a linguagem de negócio com o dia a dia do desenvolvimento. A ideia é apresentar em tempo de desenvolvimento, conceitos e nomes que sejam utilizados pela área de negócio.

Alinhamento de linguagem entre os desenvolvedores e os especialistas de negócio, para que todos falem a mesma língua e não haja ruídos de comunicação.

> Este conceito tem muita relação e importância para comunicação entre os entes envolvidos no desenvolvimento do software. Não é para ficar bonito no papel, mas para trazer clareza e entendimento entre todos os envolvidos.

### Separações principais e gerais do DDD

#### DDD Estratégico
Descoberta das áreas de conhecimento do negócio, assim como suas fronteiras e responsabilidades. Aqui a ideia é mapear e entender como o negócio funciona, e como ele se organiza para resolver os problemas que surgem.

![DDD Estratégico](image-1.png)

Aqui temos uma visão geral, e aplicação estratégica do DDD, as subareas da empresa, e como cada uma delas se relaciona com a outra. 

Geralmente é a primeira coisa que se faz, para uma aplicação saudável do DDD seja no projeto, seja na organização como um todo no dia a dia.

#### DDD Tático
Aqui temos o foco na implementação e construção da camada de domínio e como ela se relaciona com outras camadas da aplicação ou com outras aplicações. Aqui o foco é a implementação do domínio, e como ele se relaciona com o restante da aplicação.

A **Modelagem Tática** é utilizada para construir a <u>camada de domínio</u>. 
![DDD Tático](image-2.png)

A modelagem tática é a parte do DDD que se preocupa com a implementação do domínio, e como ele se relaciona com o restante da aplicação.

A nível tático, o `Clean Architecture` vai ser complementado com o DDD.

##### Objetos de Domínio
- Entities
- Value Objects
- Domain Services
- Aggregates
- Repositories*
- Factories

###### Value Objects <VO>
Também contém regras de negócio independentes, no entanto `são identificados pelo seu valor`, sendo imutáveis, ou seja, a <u>mudança implica na sua substituição</u>.

- Mede, quantifica ou descreve alguma coisa
- Seu valor é <u>imutável</u>
- É <u>substituído quando seu valor mudar</u>
- Pode ser <u>comparado pelo seu valor que representa</u>

**Exemplos**
- `Code`: Representa uma determnada regra de formação de um número
- `CPF`: Garante que o número do documento é válido
- `Dimension`: Abstrai a largura, altura, produndidade e peso de um item
- `Password`: Representa uma senha
- `Color`: Uma cor no formato RGB
- `Coord`: A latitude e longitude
- `Email`: Representa um email
- `Segment`: Representa duas posições geográficas no tempo

> A ideia do value object é que o objeto é focado e especializado em assegurar o estado do valor que ele representa. 

> `Obsessão Primitiva`: É um code smell, onde ao invés de usar o wrapper para encapsular operações referentes a um determinado valor, o desenvolvedor utiliza sempre tipos primitivos, para representação deixando a lógica de manipulação do valor espelhada e duplicada pelo código.

A identificação de possíveis candidatos para `Value Objects` seria olhar e substituir alguns tipos primitivos que estão pela aplicação "jogados".

###### Entities <E>
Abstraem regras de negócio ndependentes, tem identidade e estado, podendo sofre <u>mutação ao longo do tempo</u>.

**Exemplos**
- `Account`: O passageiro ou motorista pode ter a sua conta bloqueada,  placa do carro modificada, a senha redefinida

- `Ride`: Uma corrida pode ter o status em andamento ou finalizada, após ser finalizada o valor da tarifa é atualizado

**Como gerar identidade?**
- `Manualmente`: O próprio usuário pode gerar a identidade da entidade, pro exemplo, utilizando o email ou um documento de identificação.
- `Aplicação`: A aplicação pode utilizar um algoritmo para gerar a identidade como um gerador de UUID.
- `Banco de dados`: O banco de dados por meio de uma sequência ou outro tipo de registro, centralizando a geração da identidade.

---
> Um `Value Object`é restrito a uma `entity` ou <u>pode ser utilizado em vários lugares</u>?
---

##### Domain Service (DS)

`Realiza tarefas específicas do domínio`, não tendo estado. <u>É indicado quando a operação que você quer executar não pertence a uma entity ou a um value object</u>.

**Exemplos**
 - `DistanceCalculator`: Pegando duas coordenadas retorna a distância.
 - `FareCalculator`: Calcula o valor de um segmento da corrida.
 - `TokenGenerator`: Gera um token de acordo com um email

> Utilize em operações que envolvem multiplos objetos de domínio

Normalmente quando uma operação afeta `multiplos objetos de domínio`, não pertencendo a nenhum deles, <u>ela deve ser descrita em um domain service</u>.

> Não crie `serviços no lugar de entities e value objects`, <u>favorecendo um modelo anêmico</u>.

Como definir `relationamento`entre diferentes objetos de domínios?

> A relação de objetos de domínio não é a mesma utilizada no banco de dados

#### Aggregate

Um aggregate é um `agrupamento, ou cluster, de objetos de domínio como entities e value objets`, estabelecendo o <u>relacionamento entre eles</u>.

Grandes aggregates podem trazer `desperdício de memória, além de sobrecarregar o banco de dados sem necessidade` já que <u>nem sempre a camada de aplicação estará interessada em utiliza-lo na íntegra</u>.

> O desafio é `balancear` a <u> preservação da invariância com o consumo de recursos</u>.

Todas as operações são realizadas por meio da raíz, que é uma entity ou aggregate root.

> Aggregate é um conceito virtual. Não tem arquivo ou item aggregate. O aggregate é o objeto de domínio mais importante. 

**Boas Práticas**
- `Crie aggregates pequenos`: Comece sempre com apenas uma entidade e cresça de acordo com as necessidades.

- `Referencie outros aggregates por identidade`: Mantenha apenas a referência para outros aggregates, isso reduz a quantidade de memória e o esforço que o repositório faz para recupera-los.

Se estiver difícil de implementar o repositório, `talvez o aggregate seja muito grande` e <u>possa ser separado</u>.

Todo o aggregate deve refletir os modelos da base de dados?

Isso faria o aggregate ser `muito grande e consumir muita memória`, <u> tornando o repository mais complexo do que deveria</u>.


O aggregate pode referenciar outros aggregates? Sim, mas por identidade, nunca por referência direta.

Um aggregate pode ter apenas uma entidade? Pode, quanto menor melhor.

> Nenhuma entidade fica solta e flutuante no espaço sem pertencer a um aggregate. Se ela não está presente em nenhum aggregate, ela provavelmente é o próprio aggregate.

Uma entidade que faz parte de um aggregate pode fazer parte de outro? Não faz muito sentido, `uma mudança na entidade utilizada por um aggregate poderia causar a quebra em outro `.

Repositories

É uma extensão do domínio responsável por realizar a persistência dos aggregates, separando o domínio da infraestrutura. Tudo o que é manipulado pelo `repository` são aggregates. Eles não manipulam nem entidade diretamente e nem value objects. Eles são um intermediário entre o domínio e a camada de infraestrutura (camada de dados mais especificamente).

Diferença entre `repository` e o `DAO`.

Um repository lida a persistência de um `aggregate inteiro`, enquanto um DAO não tem uma granularidade definida.

Posso obter apenas parte do aggregate?

`Isso significa que pode ser que o aggregate seja grande mais` e poderia ser quebrado em aggregates menores.

Posso utilizar lazy loading dentro do aggregate?

`A preservação da invariância depende da integridade do aggregate`, se parte dele não estier populado pode perder o sentido.

É possível utilizar diferentes filtros para obter um aggregate?

Com certeza, na obtenção do aggregate diversos `filtros podem ser utilizados`.

Posso gerar dados para a emissão de um relatório a partir de um repository?

`A granularidade de um relatório é diferente da utilizada pelo aggregate e renderizar relatórios a  partir de repositories pode ser excessivamente complexto`, prefira a utilização de CQRS com a criação de consultas separadas.

