import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}
  /**
   * @param createShirtDto 
   * @returns 
   */
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const createProduct = new this.productModel(createProductDto);
    return createProduct.save();
  }

  /**
   * @param getAllShirt 
   * @returns 
   */
  async findAllProducts(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;
    const products = await this.productModel.find().skip(skip).limit(limit).exec();
    const totalProducts = await this.productModel.countDocuments();

    return {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    };
  }

  /**
   * 
   * @param id 
   * @param updateData 
   * @returns 
   */
  async findProductByCategory(category: string): Promise<Product[]> {
    const products = await this.productModel.find({ category });
    return products;
  }
  

  async editProduct(id: string, updateData: Partial<Product>): Promise<Product> {
    const response = await this.productModel.findByIdAndUpdate(id, updateData, { new: true });
    return response;
  }

  async deleteProduct(id: string): Promise<Product> {
    const response = await this.productModel.findByIdAndDelete(id, { new: true });
    return response;
  }
}
