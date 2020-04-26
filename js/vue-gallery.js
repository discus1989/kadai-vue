// Flickr API key
const API_KEY = 'a2e9ba12cb2ccdf37c7ea5dc96a2d05c';

/**
 * tooltip利用
 * */
 
Vue.directive('tooltip', {
  bind(el, binding) {
    $(el).tooltip({
      title: binding.value,
      placement: 'bottom',
    });
  },
  unbind(el) {
    $(el).tooltip('dispose');
  },
});


/**
 * コンポーネントのローカル登録
 * */
//猫の画像を表示
let catPhotosContent = {
  props: {
    cats: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div v-if="status" class="image-gallery">
      <div v-for="cat in cats" class="image-gallery__item">
        <a v-bind:key="cat.id"
          v-bind:href="cat.pageURL"
          v-tooltip="cat.text"
          class="d-inline-block"
          target="_blank">
            <img v-bind:src="cat.imageURL"
              v-bind:alt="cat.text"
              width="150"
              height="150">
        </a>
      </div>
    </div>`,
};

//犬の画像を表示
let dogPhotosContent = {
  props: {
    dogs: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div v-if="status" class="image-gallery">
      <div v-for="dog in dogs" class="image-gallery__item">
        <a v-bind:key="dog.id"
          v-bind:href="dog.pageURL"
          v-tooltip="dog.text"
          class="d-inline-block"
          target="_blank">
            <img v-bind:src="dog.imageURL"
              v-bind:alt="dog.text"
              width="150"
              height="150">
        </a>
      </div>
    </div>`,
};

let photosArray = {
  props: {
    dogs: {
      type: Array,
      required: true,
    },
    cats: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    'cat-photos-content': catPhotosContent,
    'dog-photos-content': dogPhotosContent,
  },
  template: `
  <div>
    <cat-photos-content v-bind:cats="cats" v-bind:status="status"></cat-photos-content>
    <dog-photos-content v-bind:dogs="dogs" v-bind:status="status"></dog-photos-content>
  </div>
  `,
};

/**
 * コンポーネントのグローバル登録
 * */
 
// Vue.component('photos-array', {
//   props: {
//     cats: {
//       type: Array,
//       required: true,
//     },
//     dogs: {
//       type: Array,
//       required: true,
//     },
//     status: {
//       type: Boolean,
//     }
//   },
//   methods: {
    
//   },
//   template: `
//   <div v-if="status">
//     <div class="image-gallery">
//       <div v-for="cat in cats" class="image-gallery__item">
//         <a v-bind:key="cat.id"
//           v-bind:href="cat.pageURL"
//           v-tooltip="cat.text"
//           class="d-inline-block"
//           target="_blank">
//             <img v-bind:src="cat.imageURL"
//               v-bind:alt="cat.text"
//               width="150"
//               height="150">
//         </a>
//       </div>
//     </div>
//     <div class="image-gallery">
//       <div v-for="dog in dogs" class="image-gallery__item">
//         <a v-bind:key="dog.id"
//           v-bind:href="dog.pageURL"
//           v-tooltip="dog.text"
//           class="d-inline-block"
//           target="_blank">
//             <img v-bind:src="dog.imageURL"
//               v-bind:alt="dog.text"
//               width="150"
//               height="150">
//         </a>
//       </div>
//     </div>
//   </div>
//   `,
// });



/**
 * ※参考：コードのひな形
 * ここまで学習した内容を基に、Vueのコードを書くときの「ひな形」を用意しました。課題に取り組む際の参考にしてください。
 */
 
new Vue({
  el: '#gallery', // elオプションの値に '#gallery' を設定
  
  components: {
    // ローカル登録するコンポーネントを設定
    // ( コンポーネントを利用しない場合は components: {}, は削除すること )
    "photos-array": photosArray,
  },

  // 利用するデータを設定
  data: function(){
    return {
      total: 0,
      catPhotos: [],
      dogPhotos: [],
      currentState: false,
    };
  },

  created() {
    // Vueが読み込まれたときに実行する処理を定義
    const vm = this;
    const urlCat = vm.getRequestURL('cat');
    const urlDog = vm.getRequestURL('dog');
    
    
    //猫の写真を取得
    $.getJSON(urlCat, (data) => {
      if (data.stat !== 'ok') {
        console.log('写真取得に失敗');
        return;
      }

      const fetchedPhotos = data.photos.photo;

      // 検索テキストに該当する画像データがない場合
      if (fetchedPhotos.length === 0) {
        console.log('写真データなし');
        return;
      }

      vm.catPhotos = fetchedPhotos.map(photo => ({
        id: photo.id,
        imageURL: vm.getFlickrImageURL(photo, 'q'),
        pageURL: vm.getFlickrPageURL(photo),
        text: vm.getFlickrText(photo),
      }));
      if(vm.catPhotos){
        console.log(vm.catPhotos);
        vm.currentState = true;
      }
    });
    
    //犬の写真を取得
    $.getJSON(urlDog, (data) => {
      if (data.stat !== 'ok') {
        console.log('写真取得に失敗');
        return;
      }

      const fetchedPhotos = data.photos.photo;

      // 検索テキストに該当する画像データがない場合
      if (fetchedPhotos.length === 0) {
        console.log('写真データなし');
        return;
      }

      vm.dogPhotos = fetchedPhotos.map(photo => ({
        id: photo.id,
        imageURL: vm.getFlickrImageURL(photo, 'q'),
        pageURL: vm.getFlickrPageURL(photo),
        text: vm.getFlickrText(photo),
      }));
      if(vm.dogPhotos){
        console.log(vm.dogPhotos);
      }
    });
    
    //犬と猫の写真が取得できれば表示させる
    if(vm.catPhotos || vm.dogPhotos) {
      vm.currentState = true;
    }
  },

  computed: {
  },

  methods: {
    // 呼び出して利用できる関数を定義( aaa や bbb の関数名を書き換えること。関数の追加も可能 )
    
    /**
     * 関数定義
     * 
     * */
    //flickrのJSONデータ取得URLを取得
    getRequestURL (searchText) {
      const parameters = $.param({
        method: 'flickr.photos.search',
        api_key: API_KEY,
        text: searchText, 
        sort: 'interestingness-desc', 
        per_page: 4, // 取得件数
        license: '4', // Creative Commons Attributionのみ
        extras: 'owner_name,license', // 追加で取得する情報
        format: 'json',
        nojsoncallback: 1,
      });
      const url = `https://api.flickr.com/services/rest/?${parameters}`;
      return url;
    },
    
    //photoオブジェクトから画像のURLを作成
    getFlickrImageURL (photo, size) {
      let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`;
      if (size) {
        // サイズ指定ありの場合
        url += `_${size}`;
      }
      url += '.jpg';
      return url;
    },
    
    // photoオブジェクトからページのURLを作成して返す
    getFlickrPageURL (photo) {
      const pageUrls = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
      return pageUrls;
    },
    
    // photoオブジェクトからaltテキストを生成して返す
    getFlickrText (photo) {
      let text = `"${photo.title}" by ${photo.ownername}`;
      if (photo.license === '4') {
        // Creative Commons Attribution（CC BY）ライセンス
        text += ' / CC BY';
      }
      return text;
    },
  },
});
