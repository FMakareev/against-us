using System;

[Serializable]
public class SerializableDict<TKey, TValue>
{
    public TKey key;
    public TValue value;
}