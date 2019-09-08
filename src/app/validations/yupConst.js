module.exports = Object.freeze({
  // ##MIXED
  DEFAULT: `\${path} is invalid`,
  REQUIRE: `\${path} is a required field`,
  ONEOF: `\${path} must be one of the following values: \${values}`,

  // ##STRING
  LENGTH: `\${path} must be exactly \${length} characters`,
  STRING_MIN: `\${path} must be at least  \${min} characters`,
  STRING_MAX: `\${path} must be at most \${max} characters`,
  MATCHES: `\${path} must match the following: "\${regex}"`,
  EMAIL: `\${path} must be a valid email`,
  URL: `\${path} must be a valid URL`,
  TRIM: `\${path} must be a trimmed string`,
  LOWERCASE: `\${path} must be a lowercase string`,
  UPPERCASE: `\${path} must be a upper case string`,

  // ##NUMBER
  NUMBER_MIN: `\${path} must be greater than or equal to \${min}`,
  NUMBER_MAX: `\${path} must be less than or equal to \${max}`,
  LESSTHAN: `\${path} must be less than \${less}`,
  MORETHAN: `\${path} must be greater than \${more}`,
  NOTEQUAL: `\${path} must be not equal to \${notEqual}`,
  POSITIVE: `\${path} must be a positive number`,
  NEGATIVE: `\${path} must be a negative number`,
  INTEGER: `\${path} must be an integer`,

  // ##DATE
  DATE_MIN: `\${path} field must be later than \${min}`,
  DATE_MAX: `\${path} field must be at earlier than \${max}`,

  // ##OBJECT
  NOUNKNOW: `\${path} field cannot have keys not specified in the object shape`,

  // ##ARRAY
  ARRAY_MIN: `\${path} field must have at least \${min} items`,
  ARRAY_MAX: `\${path} field must have less than or equal to \${max} items`,
});
