describe('Server Test:', () => {
	test('Load Test ENV', () => {
		expect(() => requireProcessEnv('test')).toThrow()			
	})
})
