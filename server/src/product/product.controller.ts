import { Controller, Post, Body, Get, Param, Put, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';


@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }
  @Get('get-all-products')
  async getAllProducts(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 5
  ) {
    try {
      const { products, totalProducts, totalPages, currentPage } = await this.productService.findAllProducts(page, limit);
      
      return {
        products,
        totalProducts,
        totalPages,
        currentPage,
      };
    } catch (error) {
      throw new HttpException('Error fetching products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get-products-category')
  async getProductByCategory(
    @Query('category') category: string  
  ) {
    try {
      const products = await this.productService.findProductByCategory(category);
      return { products };
    } catch (error) {
      throw new HttpException('Error fetching products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put('/:id')
    async editUser(
        @Param('id') id: string,
        @Body() updateData: Partial<Product>
    ): Promise<Product> {
        return await this.productService.editProduct(id, updateData);
    }

    @Delete('/:id')
    async deleteProduct(
        @Param('id') id: string,
    ): Promise<Product> {
        return await this.productService.deleteProduct(id);
    }
    
}
