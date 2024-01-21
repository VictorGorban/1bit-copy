// import { getDBInitialized } from "@src/ORM/mongoSetupDB";

// если getDBInitialized вызывать здесь, то он не находит какой-то модуль - значит тут не полноценный рантайм.
export async function register(){
    console.log('instrumentation register called', process.env.runtime)
    // await getDBInitialized();
}

export const runtime = 'nodejs'