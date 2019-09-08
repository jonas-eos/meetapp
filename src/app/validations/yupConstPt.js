module.exports = Object.freeze({
  // ##MIXED
  DEFAULT: `\${path} é inválido`,
  REQUIRE: `\${path} é obrigatório`,
  ONEOF: `\${path} deve ser igual à \${values}`,

  // ##STRING
  LENGTH: `\${path} deve ter exatamente \${length} caracteres`,
  STRING_MIN: `\${path} deve ter ao menos \${min} caracteres`,
  STRING_MAX: `\${path} por ter no máximo \${max} caracteres`,
  MATCHES: `\${path} deve corresponder ao seguinte: \${regex}`,
  EMAIL: `\${path} deve ser um email válido`,
  URL: `\${path} deve ser um URL válido`,
  TRIM: `\${path} deve ser uma string aparada`,
  LOWERCASE: `\${path} deve ser uma string em minúscula`,
  UPPERCASE: `\${path} deve ser uma string maiúscula`,

  // ##NUMBER
  NUMBER_MIN: `\${path} deve ser maior ou igual a \${min}`,
  NUMBER_MAX: `\${path} deve ser menor ou igual a \${max}`,
  LESSTHAN: `\${path} deve ser menor que \${less}`,
  MORETHAN: `\${path} deve ser maior que \${more}`,
  NOTEQUAL: `\${path} não deve ser igual a \${notEqual}`,
  POSITIVE: `\${path} deve ser um número positivo`,
  NEGATIVE: `\${path} deve ser um número negativo`,
  INTEGER: `\${path} deve ser um inteiro`,

  // ##DATE
  DATE_MIN: `\${path} deve ser posterior a \${min}`,
  DATE_MAX: `\${path} deve ser mais cedo do que \${max}`,

  // ##OBJECT
  NOUNKNOW: `\${path} não pode ter chaves não especificadas na forma do objeto`,

  // ##ARRAY
  ARRAY_MIN: `\${path} deve ter ao menos \${min} items`,
  ARRAY_MAX: `\${path} deve ter no máximo \${max} items`,
});
