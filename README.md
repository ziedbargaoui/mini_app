How to customize a Locomotive instance
=============

Menu Tab
-------

* To create a new tab, open your config/application.rb file and in the activate method, modify the MainMenuCell by calling the update_for class method.

Example:

    ::Admin::MainMenuCell.update_for(:shop) do |menu|
      menu.add_before :settings, :shop, :url => menu.admin_products_url
    end

* To create a sub menu for your new tab, just create a new class (in app/cells/admin) inheriting from Admin::SubMenuCell and do not forget to overide the build_list method.

Example:

    class Admin::ShopMenuCell < ::Admin::SubMenuCell

      protected

      def build_list
        add :products,  :url => admin_products_url
        add :orders,    :url => admin_orders_url
      end

    end

Models / Controllers
-------

The config/initializers/locomotive_loaded_first.rb file loads all the core engine classes before your own classes. Thus, you are able to open an already defined class such as Page or Site and add your code within it.
It works the same way with controllers.

Assets
-------

Put your assets in public/{stylesheets|javascripts|images}/admin and do not forget to reference them in the config/assets.yml file

Liquid
-------

All your custom liquid tags, drop and filters should be included in a module other than Locomotive.

Example:

lib/shop/liquid/drops
lib/shop/liquid/filters
...etc

At the lib/shop/liquid folder, just create the following liquid.rb file:

    require 'locomotive/liquid/drops/base'

    %w{. tags drops filters}.each do |dir|
      Dir[File.join(File.dirname(__FILE__), 'liquid', dir, '*.rb')].each do |lib|
        if Rails.env.development?
          load lib
        else
          require lib
        end
      end
    end

Finally, put a new file named shop.rb in lib/

    if Rails.env.development?
      load File.join(File.dirname(__FILE__), 'shop', 'liquid.rb')
    else
      require 'shop/liquid'
    end


If you want to access in your liquid templates your own model collections, you will have to set 2 things up.

* Create 2 drops related to both your model and the model collection.

Example:

    module Shop
      module Liquid
        module Drops
          class Products < ::Liquid::Drop

            def first
              self.collection.first
            end

            def last
              self.collection.last
            end

            def each(&block)
              self.collection.each(&block)
            end

            def each_with_index(&block)
              self.collection.each_with_index(&block)
            end

            ...etc

          end

          class Product < ::Locomotive::Liquid::Drops::Base

            delegate :name, :description, :price, :to => '_source'


            ...etc
          end
        end
      end
    end

* Specify in your model the statement to convert it into a liquid drop

Example:

    class Product
      ...etc

      def to_liquid
        Shop::Liquid::Drops::Product.new(self)
      end
    end

* Register the "collection" drop in Liquid

Open your config/application.rb and inside the activate method, write the following line:

    Locomotive.config.context_assign_extensions = { 'products' => Shop::Liquid::Drops::Products.new }

Note: do not use symbols over string

Like this, in your liquid templates, you will have access to products list

Example:

    {% for product in products %}...{{ product.name }}....{% endfor %}


