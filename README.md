# このプログラムについて

オンラインセッションツールである「どどんとふ」に接続する目的で作成したクライアントプログラムです。

* このプログラムは「どどんとふ」とは別個に作成されたものであり、「どどんとふ」の作者および著作権者とは一切の関係はありません。
* このプログラムは開発中のものであり、「どどんとふ」が持つ全ての機能を備えたものではありません。
* 個々の機能の同一性や、将来的に全ての機能が実装されることは保証しておりません。

このプログラムを使用する場合は、以上のことを自動的に了承されているものとして扱われます。

このプログラムの最新バージョンについては以下のリポジトリから取得可能です。

https://github.com/op3kitt/htmlddf.git

不具合・改善の要望などに関しては上記リポジトリまたはtwitterアカウントへDMまたはリプライにてご連絡ください。

[@ttikitt](https://twitter.com/ttikitt)

セキュリティ上重大な内容に関しては上記の公開場所ではなく、以下のメールアドレスまでご連絡ください。

[kitt &lt;yosshi1123@gmai.com&gt;](mailto:yosshi1123@gmai.com)

「どどんとふ」についての情報は以下を参照してください。

[どどんとふ＠えくすとり〜む](http://www.dodontof.com/)

# 実行環境

このプログラムの使用にはインターネットに接続可能なPCおよびウェブブラウザ―が必要です。
また、サーバーに設置された「どどんとふ」が別途必要になります。

※開発中のため、Chromeを除くウェブブラウザーは動作の対象外です。

# 設置方法

## あなたの管理しているサーバーに接続する場合

buildフォルダ以下をDodontoFServer.rbと同階層にアップロードして下さい。

## あなたの管理しているサーバーに接続するが、別階層に設置する場合

1. サーバーの任意のディレクトリにbuildフォルダ以下をアップロードして下さい。
2. [build/js/config.json](build/js/config.json)を編集して、DodontoFServer.rbのあるディレクトリを指定してください。

## あなたの管理している他のサーバーに接続する場合

1. サーバーの任意のディレクトリにbuildフォルダ以下をアップロードして下さい。
2. [build/js/config.json](build/js/config.json)を編集して、どどんとふの設置されているディレクトリを指定してください。
3. 設置しているサーバーが以下のヘッダーを返すように設定してください。
        Access-Control-Allow-Origin *
        Access-Control-Allow-Headers Origin, X-Requested-With, Content-Type, Accept

## あなたの管理していないサーバーに接続する場合

このプログラムは開発中のものであり、接続するサーバーの管理者の許可を得た上でのみ接続してください。
前記のヘッダーが返されていない場合、そのサーバーは他のクライアントの接続を許可していません。

# 設定について

カラーパレットをオリジナルのどどんとふと同一にする場合、以下のファイルを編集してください。

[build/js/config.json](build/js/config.json)

# 免責

当プログラムは現状のままで提供されるフリーソフトウェアであり、明示的または暗黙的であるかを問わず、動作およびその他の一切を保証するものではありません。
作者または著作権者は、このプログラムによって、またはこのプログラムを使用することによって発生した一切の請求、損害、その他の義務について何らの責任も負わないものとします。

# 開発者向け情報

## ビルド方法について

### コンパイルを行う環境の準備

リポジトリまたは配布サイトからソースコードを取得します。

```Shell
git clone https://github.com/op3kitt/htmlddf.git
```

Node.jsの実行環境をインストールします。

通信用ライブラリも同時にビルドする場合、
node\_modules/ddf に src/module へのシンボリックリンクを作成してください。

```Shell
ln -s src/module node_modules/ddf
```

※Windows環境では管理者権限にて以下のコマンドを実行してください。

```Batchfile
MKLINK /D node_modules\ddf ,,\src\modules
```

依存するライブラリを以下のコマンドでインストールします。

```Shell
npm install
```

以下のライブラリをグローバルにインストールしてください。

```Shell
npm install -g browserify
npm install -g gulp
```

ドキュメントの更新を行う場合は以下をインストールする必要があります。

* JSDoc

### コンパイルを行うコマンド

上記の手順でコンパイルを行う環境が整います。

デバッグ用のファイルを作成する場合は以下を実行します。

```Shell
gulp watch
```

リリース用のファイルを作成する場合は以下を実行します。

```Shell
gulp clean
gulp release
```

# ライセンスについて

このプログラムはMITライセンスの元での変更・再配布を許可します。

このプログラムに使用しているライブラリ・画像は別のライセンスである場合があります。
このプログラムに使用されているものの一覧は以下となります。

* 修正BSDライセンス
    * [どどんとふ](http://www.dodontof.com)
* MITライセンス
    * browserify
    * compare-versions
    * Date Format
    * del
    * gulp
    * gulp-cssnano
    * gulp-pug
    * gulp-rename
    * gulp-sass
    * jQuery
    * jQuery UI
    * jQuery contextMenu
    * Loaders.css
    * msgpack-lite
    * store
    * spectrum
    * tablesorter
    * uglifyify
    * vinyl-buffer
    * watchify
* Apache License
    * JSDoc
    * minami
* ISCライセンス
    * gulp-sourcemaps
* zlibライセンス
    * gulp-watchify
* その他のライセンス
    * [Mark James](http://www.famfamfam.com/lab/icons/silk/)
        * アイコン用画像集
    * [Raindropmemory](http://raindropmemory.deviantart.com/)
        * アイコン用画像の一部（参照：[http://findicons.com/icon/41229/note](http://findicons.com/icon/41229/note)）
