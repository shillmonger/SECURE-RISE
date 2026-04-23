import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne(
      { email: authUser.email },
      { projection: { cryptoAddresses: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      cryptoAddresses: user.cryptoAddresses || []
    });
  } catch (error) {
    console.error('Error fetching crypto addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { crypto, address } = body;

    if (!crypto || !address || !address.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAddress = {
      id: Date.now().toString(),
      crypto: {
        name: crypto.name,
        symbol: crypto.symbol,
        icon: crypto.icon
      },
      address: address.trim()
    };

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('users').updateOne(
      { email: authUser.email },
      { 
        $push: { cryptoAddresses: newAddress as any },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Crypto address added successfully',
      address: newAddress
    });
  } catch (error) {
    console.error('Error adding crypto address:', error);
    return NextResponse.json(
      { error: 'Failed to add crypto address' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, crypto, address } = body;

    if (!id || !crypto || !address || !address.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('users').updateOne(
      { 
        email: authUser.email,
        'cryptoAddresses.id': id
      },
      { 
        $set: { 
          'cryptoAddresses.$.crypto': {
            name: crypto.name,
            symbol: crypto.symbol,
            icon: crypto.icon
          },
          'cryptoAddresses.$.address': address.trim(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Crypto address updated successfully'
    });
  } catch (error) {
    console.error('Error updating crypto address:', error);
    return NextResponse.json(
      { error: 'Failed to update crypto address' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('users').updateOne(
      { email: authUser.email },
      { 
        $pull: { cryptoAddresses: { id } as any },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Crypto address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crypto address:', error);
    return NextResponse.json(
      { error: 'Failed to delete crypto address' },
      { status: 500 }
    );
  }
}
