import typescript from 'rollup-plugin-typescript2';

const external = [
  'tiinvo',
  'libsodium-wrappers'
];

export default [
  {
    external,
    preserveModules: true,
    input: ['src/index.ts'],
    output: [{ dir: 'dist/cjs', format: 'cjs', entryFileNames: '[name].js' }],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  },
]
