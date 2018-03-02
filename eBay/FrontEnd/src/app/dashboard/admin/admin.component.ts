import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToasterService } from 'angular5-toaster';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: []
})
export class AdminComponent implements OnInit {

  currentUser: any;
  public itemsList = [];
  addClicked: boolean = false;
  productName: String = null;
  productPrice: Number = null;
  public itemsState = [];


  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private authService: AuthService,
    private toaster: ToasterService,
    private router: Router
  ) { }

  removeProduct(id) {
    this.http.delete('http://localhost:3000/api/product/deleteProduct/' + id)
      .subscribe(res => {
        this.fetchItems();
      });
  }

  editProduct(j) {
    this.itemsState[j] = true;
    let i;
    for (i = 0; i < this.itemsList.length; i++) {
      if (i != j)
        this.itemsState[i] = false;
    }
  }

  updateProduct(id, i, name, price) {

    let updatedProduct = {
      name: name,
      price: price
    };
    if (name == undefined || name == "" || price == null || price == undefined) {
      this.toaster.pop({
        type: 'info',
        title: "Product was not updated",
        body: "You need to specify the name and the price",
        timeout: 2000
      });
      return false;
    }
    if (price <= 0) {
      this.toaster.pop({
        type: 'info',
        title: "Product was not updated",
        body: "Price needs to be more than a $0",
        timeout: 2000
      });
      return false;
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.patch('http://localhost:3000/api/product/updateProduct/' + id, updatedProduct, { headers: headers })
      .subscribe(res => { this.fetchItems(); });
    this.toaster.pop({
      type: 'success',
      title: "Success!",
      body: "Product has been updated successfully!",
      timeout: 2000
    });

  }

  fetchItems() {

    this.httpClient.get<any>('http://localhost:3000/api/product/getProducts')
      .subscribe(
        res => {
          this.itemsList = res.data;
          let i;
          for (i = 0; i < this.itemsList.length; i++) {
            this.itemsState[i] = false;
          }

        });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
    if (this.currentUser.role !== "manager" && this.currentUser.role !== "admin")
      this.router.navigate(['dashboard/store']);
    this.fetchItems();
  }

}
