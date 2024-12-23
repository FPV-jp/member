package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan []byte)

func main() {
	// WebSocketエンドポイントを設定
	http.HandleFunc("/ws", handleConnections)

	// メッセージブロードキャスト用のゴルーチン
	go handleMessages()

	// サーバー起動
	log.Println("シグナリングサーバーをポート8080で起動中...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("サーバー起動エラー: %v", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// WebSocket接続をアップグレード
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocketアップグレードエラー: %v", err)
		return
	}
	defer ws.Close()

	// クライアントを登録
	clients[ws] = true

	for {
		// メッセージ受信
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("メッセージ受信エラー: %v", err)
			delete(clients, ws)
			break
		}

		// メッセージをブロードキャスト
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		// ブロードキャストチャンネルからメッセージを取得
		msg := <-broadcast
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Printf("メッセージ送信エラー: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
