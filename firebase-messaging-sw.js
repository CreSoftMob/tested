// public/firebase-messaging-sw.js

// Importe os scripts do SDK do Firebase que são necessários no Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// ⚠️ SUBSTITUA PELAS SUAS CHAVES DE CONFIGURAÇÃO DO FIREBASE ⚠️
const firebaseConfig = {
    apiKey: "AIzaSyAWPLRTgbBWhwPGf6yK_R85sh6NYSmqPvY",
    authDomain: "app-create-a3dfd.firebaseapp.com",
    projectId: "app-create-a3dfd",
    storageBucket: "app-create-a3dfd.firebasestorage.app",
    messagingSenderId: "129112776900",
    appId: "1:129112776900:web:360f27176f339a3dec2991",
};

// 1. Inicializa o Firebase no Service Worker
firebase.initializeApp(firebaseConfig);

// 2. Recupera o serviço de Messaging
const messaging = firebase.messaging();

// 3. Ouve mensagens em SEGUNDO PLANO (App fechado ou não em foco)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensagem de segundo plano recebida:', payload);

    const notificationTitle = payload.notification.title || 'Nova Mensagem';
    
    const notificationOptions = {
        body: payload.notification.body || 'Você recebeu uma nova mensagem.',
        icon: payload.notification.icon || '/icon-192x192.png', // Substitua pelo caminho de um ícone seu
        data: payload.data, // Dados personalizados, útil para navegar ao clicar
    };

    // Exibe a notificação de sistema
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Opcional: Lida com o clique na notificação em segundo plano
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    // Você pode definir a URL base para abrir o app no chat correto
    const targetUrl = event.notification.data.chatId ? `/messages/${event.notification.data.chatId}` : '/connections';

    event.waitUntil(
        clients.matchAll({
            type: 'window'
        }).then((windowClients) => {
            // Tenta focar em uma janela já aberta do app
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // Se não houver janela aberta, abre uma nova
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});