# 1 Casos de prueba ejecutados

Se ejecutaron 137 pruebas de aplicación sobre el código 0274f2b y 14 comprobaciones complementarias del mismo código. El catálogo contiene 151 registros únicos: 57 de frontend, 54 de API, 26 de navegador, nueve de Docker y cinco SMTP. No se suman repeticiones de desarrollo para aumentar el total.

Cada ficha del anexo identifica módulo, requisito, pasos, resultado esperado, obtenido, estado, fecha, entorno y evidencia. El catálogo completo también está en casos_ejecutados.csv y casos_ejecutados.json. Los E2E-DESKTOP-01 a 13 y E2E-MOBILE-01 a 13 corresponden a trece escenarios ejecutados en dos configuraciones distintas.

Los resultados obtenidos expresan las aserciones confirmadas por el runner. La precisión temporal se declara por caso: fin de la suite API, fin del archivo frontend, inicio individual de navegador, fin de cada comprobación Docker o fin del lote SMTP. Se conservan las fechas y horas reales; no se atribuyen instantes individuales donde no existen.

Todos los registros finalizaron APROBADOS, con cero fallos y cero omisiones. Las pruebas usan cuentas sintéticas y esquemas PostgreSQL desechables; la sección 6 distingue alcance probado y pendientes funcionales.
