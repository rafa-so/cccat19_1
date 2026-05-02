# Introdução
Anotações e esquemas sobre a aula 02 do curso de arquitetura e código limpos

Testes
Foi visto os mais diversos níveis dos principais tipos de testes:
- unidade
- integração
- end 2 end

Aqui também foi visto a pirâmide de custo e complexidade de cada teste. É importante ter conhecimento de quando cada um dos tipos de teste podem ser aplicados e a forma de aplicação.

SOLID
Coleção de princípios para coesão e flexibilidade de construção de software

SRP - Single Responsability Principle
Uma classe deveria ter apenas um motivo para mudar, senão, ela tem várias responsabilidades acopladas entre si.

IDP - Inversion Dependency Principle


Arquitetura Hexagonal
Um dos princípios da AH os componentes conforme a sua responsabilidade em driver e resource.

Driver, é tudo o que é um recurso interno da aplicação, separada do regra de negócio.

Resource, são recursos externos, que também são isolados.

