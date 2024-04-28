import { createApp } from 'vue'; // Importar createApp do Vue
import App from './App.vue';
import router from './router';
import store from './store';
import 'tailwindcss/tailwind.css'



const app = createApp(App); // Criar instância do aplicativo

app.use(router); // Adicionar o router ao aplicativo
app.use(store); // Adicionar a store ao aplicativo

app.mount('#app'); // Montar o aplicativo no elemento com id "app"