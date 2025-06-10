import { JSONFilePreset } from 'lowdb/node'

//[
// {key1: "Viande haché", value1: 0, key2: "Viande haché", value2: 0, },
// {key1: "Viande haché", value1: 0, key2: "Viande haché", value2: 0, },
//]
const defaultData = {
    questions: []
}

const db = await JSONFilePreset('db.json', defaultData)

export { db };