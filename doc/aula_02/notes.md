# Introdução
Anotações e esquemas sobre a aula 02 do curso de arquitetura e código limpos

## Testes
Foi visto os mais diversos níveis dos principais tipos de testes:
- unidade
- integração
- end 2 end

Aqui também foi visto a pirâmide de custo e complexidade de cada teste. É importante ter conhecimento de quando cada um dos tipos de teste podem ser aplicados e a forma de aplicação.

## SOLID
Coleção de princípios para coesão e flexibilidade de construção de software

## SRP - Single Responsability Principle
Uma classe deveria ter apenas um motivo para mudar, senão, ela tem várias responsabilidades acopladas entre si.

## IDP - Inversion Dependency Principle
6
## Arquitetura Hexagonal
Um dos princípios da AH os componentes conforme a sua responsabilidade em driver e resource.

Driver, é tudo o que é um recurso interno da aplicação, separada do regra de negócio.

Resource, são recursos externos, que também são isolados.

### DAO - Data Access Object
Objeto de acesso a dados. Não é exatamente um mapeamento de ORM, mas serve para ter um nível entre a entidade em base, e o objeto na aplicação

## Test Patterns

- Double -> é um padrão que tem como objetivo de substituir um DOC (depended-on component) em um determinado tipo de teste por motivos de performance ou segurança
- Dummy -> Objetos que criamos apenas para completar a lista de parâmetros que preicsamos passar para invocar um determinado método
- Mock -> Objetos similares a stubs e spies, permitem que você diga exatamente o que quer que ele faça e o teste vai quebrar se isso não acontecer
- Stub -> Objetos que retornam responstas prontas, definidas para um determinado teste, por quesão de performance ou segurança
- Spy -> Objetos que "espionam" a execução do método e armazenam os resultados para verificação posterior.
- Fake -> Objetos que tem implementações que simulam o funcionamento da instâcia real, que seria utilizada em produção

Stubs x Fakes
 Muitas vezes o stub reflete uma parte, um método, que se quer simular ou sobrescrever o resultado, o fake é a classe toda minificada, e estática. Com os valores falsos.

 