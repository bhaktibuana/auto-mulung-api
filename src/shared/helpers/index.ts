export class Helper {
    /**
     * Sleep the program
     * 
     * @param ms 
     * @returns 
     */
	public static async sleep(ms: number): Promise<unknown> {
		return await new Promise((resolve) => setTimeout(resolve, ms));
	}
}
