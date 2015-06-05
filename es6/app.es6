import Rx from 'rx'
import $ from 'jquery'

// 入力イベントを起点とする
var inputStream = Rx.Observable.fromEvent($('#search'), 'input')
  .filter( // 文字数が０以上の場合のみ stream に載せる
    (e) => e.target.value.length > 0
  )
  .map( // 入力文字を取得
    (e) => e.target.value
  );

// 入力イベントの stream から URLを生成する
var urlStream = inputStream
  .map(
　  // Qiitaの検索API
    (value) => 'http://qiita.com/api/v1/search?q=' + value + '&per_page=10'
  );

// URL の stream から API を発行する
var apiStream = urlStream
  .flatMap(
    (url) => {
      let promise = $.ajax(url);
      return Rx.Observable.fromPromise(promise);
    }
  );

// stream の購読
apiStream.subscribe(
  (res) => {
    // 一旦、リストをクリアする
    $('li').remove();
    // 結果(複数件)に対して１件づつ処理
    res.forEach(
      (element, index, array) => {
        // リストに追加
        $(`<li><a href="${element.url}" target="_blank">${element.title}</a></li>`).appendTo('#result');
      }
    );
  }
);