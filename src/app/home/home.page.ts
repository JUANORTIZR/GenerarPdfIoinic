import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Plugins,  } from '@capacitor/core';

const { Filesystem } = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Directory } from '@capacitor/filesystem';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  pdfObject: any;
  constructor(
    private plt: Platform
    , private fileOpener: FileOpener
    , private androidPermissions: AndroidPermissions
    ) { }

  ngOnInit() {

  }

  createPdf() {
    const docDefinitions = {
      watermark: { text: 'AGRORGANICO SEMILLAS', color: 'green', italic: true },
      content: [
        {
          columns: [
            {
              text: 'Holis',
              alignment: 'center'
            }
        ]
        }


      ]
    }

    this.pdfObject = pdfMake.createPdf(docDefinitions);
    console.log("Generado");

  }

  downloadPdf() {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
    if (this.plt.is('cordova')) {
      this.pdfObject.getBase64(async (data) => {
        try {
          let path = `pdf/myletter_${Date.now()}.pdf`;

         await Filesystem.writeFile({
            path: `pdf/myletter_${Date.now()}.pdf`,
            data: data,
            directory: Directory.Documents,
            recursive: true
          })
         // this.fileOpener.open(`${result.uri}`, 'application/pdf');
        } catch (error) {
          console.error('Unable to write file', error);
        }
      });
    } else {
      this.pdfObject.download();
    }
  }


  openPdf(){
    this.pdfObject.open();
  }
}
